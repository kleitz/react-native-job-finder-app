import React, { Component } from 'react'
import I18n from 'react-native-i18n'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Actions } from 'react-native-router-flux'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Keyboard,
  Dimensions,
  Platform,
  StatusBar
} from 'react-native'

import fonts from '../../../Common/fonts'
import colors from '../../../Common/colors'
import SealHeader from '../../../Common/SealHeader'
import Button from '../../../Common/Button'
import ProgressBar from '../widgets/ProgressBar'

import selectors from '../../createVacancy.selectors'
import { getInternetStatus } from '../../../Utility/netInfo/netInfo.selectors'
import { changeGeneralInfoFields, accessedScreen } from '../../createVacancy.actions'

const root = what => `createVacancy.wageScreen.${what}`
const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

const nextBtnHeight = 50

class Wage extends Component {

  constructor (props) {
    super(props)

    this.state = {
      nextButtonPosition: screenHeight - nextBtnHeight
    }
  }

  componentDidMount () {
    this.refs.wageInput.focus()
    this.props.accessedScreen({
      propToUpdate: 'accessedWage'
    })

    this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardShow)
    this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardHide)
  }

  componentWillUnmount () {
    this.keyboardDidShowSub.remove()
    this.keyboardDidHideSub.remove()
  }

  keyboardShow = (event) => {
    const newPosition = Platform.OS === 'ios'
      ? screenHeight - event.endCoordinates.height - nextBtnHeight
      : screenHeight - StatusBar.currentHeight - event.endCoordinates.height - nextBtnHeight

    this.setState({
      nextButtonPosition: newPosition
    })
  }

  keyboardHide = (event) => {
    const newPosition = Platform.OS === 'ios'
      ? screenHeight - nextBtnHeight
      : screenHeight - StatusBar.currentHeight - nextBtnHeight

    this.setState({
      nextButtonPosition: newPosition
    })
  }

  changeText = (type) => (text) => {
    const { changeGeneralInfoFields } = this.props
    changeGeneralInfoFields({ [type]: text })
  }

  goToMain = () => {
    Actions.pop()
    setTimeout(() => {
      Actions.createVacancy()
    })
  }

  render () {
    const { wageCents } = this.props.info
    const { nextButtonPosition } = this.state
    return (
      <View
        style={{flex: 1, backgroundColor: colors.background}}
        >
        <SealHeader
          leftIconSize={14}
          leftBtnFn={this.goToMain}
          leftBtnText={'icon-back'}
          title={I18n.t(root('title'))}
          />
        <ProgressBar step={9} totalSteps={9} />
        <Text style={styles.hint1}>{I18n.t(root('hint'))}</Text>

        <View style={styles.inputGroup}>
          <Text style={[styles.inputIcon, {fontSize: 16, color: colors.lightBlue}]}>
            €
          </Text>
          <TextInput
            ref='wageInput'
            maxLength={5}
            value={wageCents}
            keyboardType={'numeric'}
            onFocus={this.scrollToBottom}
            placeholder={I18n.t(root('wage'))}
            underlineColorAndroid={'transparent'}
            onChangeText={this.changeText('wageCents')}
            placeholderTextColor={colors.placeholderGray}
            style={[styles.wageInput, Platform.OS === 'android' && {paddingTop: 13}]}
            />
          <Text style={styles.hourLabel}>/h</Text>
          <Text style={styles.optionalLabel}>{I18n.t(root('optional'))}</Text>
        </View>

        <Text style={styles.infoText}>
          {I18n.t(root('hint2'))}
        </Text>

        <Button
          opacity={1}
          onPress={this.goToMain}
          btnStyle={[styles.nextBtn, {top: nextButtonPosition}]}
        >
          {I18n.t('buttons.finish').toUpperCase()}
        </Button>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  hasInternet: getInternetStatus(state),
  info: selectors.generalInfo.getGeneralInfo(state)
})

const mapDispatchToProps = dispatch => bindActionCreators({
  changeGeneralInfoFields, accessedScreen
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Wage)

const styles = StyleSheet.create({
  hint1: {
    fontFamily: fonts.openSansLight,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 25,
    marginBottom: 15
  },
  infoText: {
    marginHorizontal: 13,
    marginTop: 5,
    marginBottom: 25,
    color: colors.warmGrey,
    fontSize: 14,
    fontFamily: fonts.openSansRegular,
    letterSpacing: -0.2,
    textAlign: 'center'
  },
  inputGroup: {
    alignItems: 'center',
    backgroundColor: colors.white,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.inputBorder,
    height: 42
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: fonts.openSansRegular,
    color: colors.dark,
    textAlign: 'left',
    paddingLeft: 13
  },
  inputIcon: {
    paddingLeft: 13
  },
  nextBtn: {
    borderRadius: 0,
    height: nextBtnHeight,
    width: screenWidth,
    position: 'absolute'
  },
  wageInput: {
    height: 44,
    paddingRight: 3,
    textAlign: 'right',
    textAlignVertical: 'center',
    fontSize: 16,
    minWidth: 65
  },
  hourLabel: {
    fontFamily: fonts.openSansRegular,
    fontSize: 16,
    color: colors.lightBlue
  },
  optionalLabel: {
    position: 'absolute',
    top: 8,
    right: 20,
    fontSize: 16,
    fontFamily: fonts.openSansRegular,
    color: colors.fadedGray
  }
})
