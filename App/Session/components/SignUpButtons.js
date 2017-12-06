import React from 'react'
import PropTypes from 'prop-types'
import I18n from 'react-native-i18n'
import { Actions } from 'react-native-router-flux'
import { View, Text, StyleSheet, Animated, Dimensions, TouchableWithoutFeedback } from 'react-native'

import fonts from '../../Common/fonts'
import colors from '../../Common/colors'
import Button from '../../Common/Button'
import SealIcon from '../../Common/SealIcon'

import Config from 'react-native-config'

const { width } = Dimensions.get('window')
const SignUpButtons = ({showStart, animatedHeight, setStartVisibility}) => {
  const buttonTextOpacity = animatedHeight.interpolate({
    inputRange: [50, 220],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  })
  return (
    <Animated.View style={[styles.container, {height: animatedHeight}]}>
      {
        showStart
          ? <TouchableWithoutFeedback onPress={setStartVisibility(false)}>
            <Animated.View style={styles.startButton}>
              <Animated.Text style={[styles.startText, {opacity: buttonTextOpacity}]}>
                START
              </Animated.Text>
            </Animated.View>
          </TouchableWithoutFeedback>
          : <View style={styles.signUpButtonContainer}>
            <TouchableWithoutFeedback onPress={setStartVisibility(true)}>
              <View style={styles.hideButton}>
                <SealIcon name={'down'} color={colors.white} size={8} />
              </View>
            </TouchableWithoutFeedback>
            <Button
              btnStyle={[styles.signUpButtons]}
              labelStyle={[styles.signUpButtonsLabel]}
              onPress={() => { Actions.auth({ selectedTab: 1 }) }}
              >
              <Text>{I18n.t('auth.signUp')}</Text>
            </Button>
            <Button
              labelStyle={[styles.signUpButtonsLabel]}
              btnStyle={[styles.signUpButtons, styles.loginButton]}
              onPress={() => { Actions.auth({ selectedTab: 0 }) }}
              >
              <Text>{`${I18n.t('auth.login')}`}</Text>
            </Button>
          </View>
      }
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    width
  },
  startButton: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: colors.dark
  },
  startText: {
    fontSize: 16,
    fontFamily: fonts.openSansRegular,
    color: colors.white,
    letterSpacing: -0.3
  },
  hideButton: {
    marginTop: 15,
    height: 30,
    width,
    justifyContent: 'center',
    alignItems: 'center'
  },
  signUpButtonContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.dark
  },
  signUpButtons: {
    marginVertical: 10,
    width: width - 23 * 2
  },
  loginButton: {
    backgroundColor: 'transparent',
    borderColor: colors.white,
    borderWidth: 1
  },
  signUpButtonsLabel: {
    fontFamily: fonts.openSansLight,
    fontSize: 16,
    textAlign: 'center',
    letterSpacing: -0.3,
    color: colors.white
  }
})

SignUpButtons.propTypes = {
  showStart: PropTypes.bool,
  animatedHeight: PropTypes.any,
  setVisibility: PropTypes.func
}

export default SignUpButtons
