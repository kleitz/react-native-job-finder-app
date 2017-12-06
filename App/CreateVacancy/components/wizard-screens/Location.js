import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Actions } from 'react-native-router-flux'
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Dimensions,
  Keyboard,
  StatusBar
} from 'react-native'

import colors from '../../../Common/colors'
import fonts from '../../../Common/fonts'
import SealHeader from '../../../Common/SealHeader'
import Button from '../../../Common/Button'
import AddressAutocomplete from '../../../Common/AddressAutocomplete'
import ProgressBar from '../widgets/ProgressBar'

import selectors from '../../createVacancy.selectors'
import { changeLocationField } from '../../createVacancy.actions'

import utils from '../../../Utility/utils'
const T = utils.translateHelper('createVacancy.location')
const BT = utils.translateHelper('buttons')

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

const nextBtnHeight = 50

class JobLocation extends Component {
  constructor (props) {
    super(props)

    this.state = {
      nextButtonPosition: screenHeight - nextBtnHeight
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

  state = {
    fetching: false
  }

  goToMain = () => {
    Actions.pop()
    setTimeout(() => {
      Actions.createVacancy()
    })
  }

  nextStep = () => {
    Actions.pop()
    setTimeout(() => {
      Actions.nvSchedule()
    })
  }

  handleSelection = (value) => {
    this.props.changeLocationField(value)
  }

  handleFetching = (fetching) => {
    this.setState({fetching})
  }

  render () {
    const { validation } = this.props
    const { nextButtonPosition } = this.state
    const instructions = !this.state.fetching &&
      <Text style={styles.instructions}>{T('hint')}</Text>

    return (
      <View style={styles.container}>
        <SealHeader
          leftIconSize={14}
          title={T('title')}
          leftBtnFn={this.goToMain}
          leftBtnText={'icon-back'}
          />
        <ProgressBar step={4} totalSteps={9} />
        <AddressAutocomplete
          autofocus
          placeholder={T('address')}
          oldLocation={this.props.address}
          onFetching={this.handleFetching}
          updateAddress={this.handleSelection}
          onOptionSelect={this.handleSelection}
          />
        {instructions}

        <Button
          opacity={1}
          onPress={this.nextStep}
          btnStyle={[styles.nextBtn, {top: nextButtonPosition}]}
          disabled={!validation.hasLocation}
        >
          {BT('next').toUpperCase()}
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
  instructions: {
    color: colors.warmGrey,
    position: 'absolute',
    ...Platform.select({
      ios: {
        top: 80 + 30 + 42 + 20
      },
      android: {
        top: 75 + 30 + 42 + 20
      }
    }),
    left: 0,
    right: 0,
    letterSpacing: -0.2,
    fontSize: 14,
    paddingLeft: 15,
    fontFamily: fonts.openSansRegular
  },
  nextBtn: {
    borderRadius: 0,
    height: 50,
    position: 'absolute',
    width: screenWidth
  }
})

const mapStateToProps = state => ({
  address: selectors.location.getLocation(state),
  validation: selectors.getCompleteStatus(state)
})

const mapDispatchToProps = dispatch => bindActionCreators({
  changeLocationField
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(JobLocation)
