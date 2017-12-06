import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  StyleSheet,
  TextInput
} from 'react-native'
import I18n from 'react-native-i18n'

import colors from '../../../Common/colors'
import fonts from '../../../Common/fonts'

class TextEditor extends Component {
  handleTextChange = (text) => {
    this.props.onChangeText(text, text)
  }

  stripTextFromTags = (text) =>
    text
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, '')

  render () {
    return (
      <View style={styles.container}>
        <TextInput
          multiline
          autoCorrect={false}
          style={styles.textInput}
          value={this.stripTextFromTags(this.props.initialText)}
          onChangeText={this.handleTextChange}
          placeholder={I18n.t('createVacancy.descriptionScreen.placeholder')}
          />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: 260,
    borderBottomWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: colors.white
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontFamily: fonts.openSansRegular,
    color: colors.dark,
    fontSize: 14
  }
})

TextEditor.propTypes = {
  onChangeText: PropTypes.func,
  initialText: PropTypes.string
}

export default TextEditor
