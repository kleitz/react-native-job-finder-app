import React, {Component} from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import {
  StyleSheet,
  Text,
  View,
  ListView,
  TextInput,
  TouchableWithoutFeedback,
  Animated,
  ActivityIndicator
} from 'react-native'

import AutocompleteService from './autocomplete.service'
import colors from './colors'

const SUGGESTION_HEIGHT = 40
const DURATION = 200

class AddressAutocomplete extends Component {
  constructor (props) {
    super(props)
    this.state = {
      suggestions: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      }),
      textValue: this.props.oldLocation || '',
      optionsHeight: new Animated.Value(0),
      fetching: false
    }

    this.changed = _.debounce(this.getSuggestions, 500)
  }

  componentDidMount () {
    if (this.props.autofocus) {
      this.refs.autocompleteInput.focus()
    }
  }

  handleChange = e => {
    const val = e.nativeEvent.text
    const { onFetching, updateAddress } = this.props

    val === '' && this.setState({suggestions: this.state.suggestions.cloneWithRows([])})

    this.setState({
      textValue: val,
      selectedValue: null,
      fetching: val !== ''
    }, () => {
      onFetching && onFetching(this.state.fetching)
      this.changed(val)
      updateAddress && updateAddress(val)
    })
  }

  getSuggestions = (text) => {
    text !== '' &&
    AutocompleteService
      .getSuggestions(text, 'en')
      .then(response => response.json())
      .then(result => {
        if (result.status === 'OK' && result) {
          return result
        } else {
          throw new Error(`Request failed with status: ${result.status}`)
        }
      })
      .then(result => {
        this.setState({
          suggestions: this.state.suggestions.cloneWithRows(result.predictions),
          fetching: false
        }, this.animate(result.predictions.length))
      }).catch(err => {
        console.log(err)
        this.setState({ fetching: false })
      })
  }

  pressRow = (rowData) => () => {
    const {onOptionSelect, onFetching} = this.props
    this.setState({
      selectedValue: rowData.description,
      suggestions: this.state.suggestions.cloneWithRows([])
    }, () => {
      onOptionSelect && onOptionSelect(rowData.description)
    })
    onFetching && onFetching(false)
  }

  renderRow = (rowData) => {
    const {customStyles} = this.props
    return (
      <TouchableWithoutFeedback onPress={this.pressRow(rowData)}>
        <View style={[styles.listViewItem, customStyles.listViewItem]}>
          <Text style={styles.listViewItemText}>{rowData.description}</Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  animate = (suggestionsLength) => {
    return () => {
      Animated.timing(this.state.optionsHeight, {
        toValue: SUGGESTION_HEIGHT * suggestionsLength,
        duration: DURATION
      }).start()
    }
  }

  render () {
    const {customStyles} = this.props
    const {optionsHeight, suggestions, selectedValue, textValue, fetching} = this.state
    const content = fetching
      ? (<ActivityIndicator animating={fetching} size='large' style={styles.loader} />)
      : (
        <Animated.View style={[
          customStyles.listView, {
            height: optionsHeight
          }
        ]}>
          <ListView enableEmptySections dataSource={suggestions} renderRow={this.renderRow.bind(this)} />
        </Animated.View>
      )

    return (
      <View style={customStyles.autocomplete}>
        <TextInput
          ref='autocompleteInput'
          autoCorrect={false}
          placeholder={this.props.placeholder || 'Enter an address'}
          underlineColorAndroid={'transparent'}
          placeholderTextColor={colors.placeholderGray}
          onChange={this.handleChange} value={selectedValue || textValue}
          style={[styles.autocompleteInput, customStyles.autocompleteInput]}
          />
        {content}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  autocompleteInput: {
    fontSize: 16,
    letterSpacing: -0.3,
    height: 42,
    backgroundColor: colors.white,
    color: colors.dark,
    marginTop: 50,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    justifyContent: 'center',
    paddingLeft: 15,
    paddingRight: 15
  },
  listViewItem: {
    backgroundColor: colors.white,
    height: 40,
    borderBottomWidth: 1,
    borderColor: colors.inputBorder,
    justifyContent: 'center',
    paddingLeft: 15
  },
  listViewItemText: {
    fontSize: 14,
    letterSpacing: -0.3,
    color: colors.dark
  },
  loader: {
    marginTop: 50,
    alignItems: 'center'
  }
})

AddressAutocomplete.propTypes = {
  placeholder: PropTypes.string,
  onOptionSelect: PropTypes.func,
  onFetching: PropTypes.func,
  customStyles: PropTypes.object
}

AddressAutocomplete.defaultProps = {
  customStyles: {}
}

export default AddressAutocomplete
