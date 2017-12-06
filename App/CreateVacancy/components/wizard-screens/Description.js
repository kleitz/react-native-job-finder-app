import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  Platform,
  Dimensions,
  StatusBar
} from 'react-native'
import I18n from 'react-native-i18n'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import colors from '../../../Common/colors'
import fonts from '../../../Common/fonts'
import SealHeader from '../../../Common/SealHeader'
import Button from '../../../Common/Button'
import ProgressBar from '../widgets/ProgressBar'

import TextEditor from '../widgets/TextEditor'
import selectors from '../../createVacancy.selectors'
import { changeDescriptionFields } from '../../createVacancy.actions'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

const minChars = 50
const nextButtonHeight = 50
const progressBarHeight = 7
const headerHeight = 57
const toolbarHeight = 35

class Description extends Component {
  constructor (props) {
    super(props)

    let { description } = this.props.description
    let nextButtonPosition = Platform.OS === 'ios'
      ? screenHeight - nextButtonHeight
      : screenHeight - StatusBar.currentHeight - nextButtonHeight

    this.state = {
      currentCharacters: description ? description.length : 0,
      textValue: description || '',
      keyboardOn: false,
      shouldDisableNextButton: !description || description.length <= minChars,
      editorHeight: 240,
      keyboardHeight: 0,
      nextButtonPosition: nextButtonPosition
    }
  }

  componentDidMount () {
    this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardShow)
    this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardHide)
  }

  componentWillUnmount () {
    this.keyboardDidShowSub.remove()
    this.keyboardDidHideSub.remove()
  }

  keyboardShow = (event) => {
    const newPosition = Platform.OS === 'ios'
      ? screenHeight - event.endCoordinates.height - nextButtonHeight
      : screenHeight - StatusBar.currentHeight - event.endCoordinates.height - nextButtonHeight

    this.setState({
      keyboardOn: true,
      nextButtonPosition: newPosition,
      editorHeight: [
        screenHeight,
        StatusBar.currentHeight || 0,
        headerHeight,
        progressBarHeight,
        toolbarHeight,
        nextButtonHeight,
        event.endCoordinates.height
      ].reduce((curr, acc) => curr - acc)
    })
  }

  keyboardHide = (event) => {
    const newPosition = Platform.OS === 'ios'
      ? screenHeight - nextButtonHeight
      : screenHeight - StatusBar.currentHeight - nextButtonHeight

    this.setState({
      keyboardOn: false,
      nextButtonPosition: newPosition,
      editorHeight: 240
    })
  }

  handleTextChange = (plainText, richText) => {
    this.setState({
      currentCharacters: plainText.replace(/\s+/g, '').length, // count all characters but newlines
      textValue: richText,
      shouldDisableNextButton: plainText.replace(/\s+/g, '').length <= minChars
    })
  }

  goToMain = () => {
    this.props.changeDescriptionFields('description', this.state.textValue)
    Actions.pop()
    setTimeout(() => {
      Actions.createVacancy()
    })
  }

  nextStep = () => {
    this.props.changeDescriptionFields('description', this.state.textValue)
    Actions.pop()
    setTimeout(() => {
      Actions.nvWage()
    })
  }

  verifyRequirement = () => {
    return this.state.currentCharacters >= minChars ? colors.lightBlue : colors.salmon
  }

  render () {
    const {
      currentCharacters,
      textValue,
      keyboardOn,
      shouldDisableNextButton,
      editorHeight,
      nextButtonPosition
    } = this.state

    return (
      <View style={styles.container}>
        <SealHeader
          leftIconSize={14}
          leftBtnFn={this.goToMain}
          leftBtnText={'icon-back'}
          title={I18n.t('createVacancy.descriptionScreen.title')}
        />
        <ProgressBar step={8} totalSteps={9} />

        <TextEditor
          onChangeText={this.handleTextChange}
          initialText={textValue}
          editorHeight={editorHeight}
          />
        <View style={{flexDirection: 'row', paddingHorizontal: 10, justifyContent: 'space-between'}}>
          <Text style={[styles.text, {color: colors.lightBlue}]}>
            {I18n.t('createVacancy.descriptionScreen.textRequirement')}
          </Text>
          <Text style={[styles.text, {color: this.verifyRequirement()}]}>
            {currentCharacters}
          </Text>
        </View>
        <Text style={
          [
            styles.text,
            {color: colors.warmGrey, paddingHorizontal: 10, marginTop: 15},
            keyboardOn && {opacity: 0}
          ]
        }>
          {I18n.t('createVacancy.descriptionScreen.hint')}
        </Text>

        <Button
          opacity={1}
          onPress={this.nextStep}
          btnStyle={[styles.nextBtn, {top: nextButtonPosition}]}
          disabled={shouldDisableNextButton}
          >
          {I18n.t('buttons.next').toUpperCase()}
        </Button>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  text: {
    fontFamily: fonts.openSansRegular,
    fontSize: 14
  },
  nextBtn: {
    borderRadius: 0,
    height: nextButtonHeight,
    position: 'absolute',
    width: screenWidth
  }
})

const mapStateToProps = state => ({
  description: selectors.description.getDescription(state),
  validation: selectors.getCompleteStatus(state)
})

const mapDispatchToProps = dispatch => bindActionCreators({
  changeDescriptionFields
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Description)
