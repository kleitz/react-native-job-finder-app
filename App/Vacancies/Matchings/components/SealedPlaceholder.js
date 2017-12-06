import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Actions } from 'react-native-router-flux'
import { View, Text, Image, StyleSheet } from 'react-native'

import utils from 'utils/utils'
import fonts from 'common/fonts'
import colors from 'common/colors'
import Images from '../../../Images'

const T = utils.translateHelper('manageApplicants')

const SealedPlaceholder = () => (
  <View style={styles.container}>
    <Image source={Images.common.sealedPlaceholder} style={styles.logo} />
    <Text style={styles.title}>{T('noSeals')}...</Text>
    <Text style={styles.description}>{T('sealDescription')}</Text>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingHorizontal: 40
  },
  logo: {
    width: 75,
    height: 110,
    marginTop: 90
  },
  title: {
    fontFamily: fonts.openSansLight,
    fontSize: 20,
    letterSpacing: -0.3,
    color: colors.dark,
    paddingTop: 15
  },
  description: {
    fontFamily: fonts.openSans,
    fontSize: 14,
    letterSpacing: -0.2,
    color: colors.buttonGrey,
    paddingTop: 8,
    textAlign: 'center'
  },
  btnStyle: {
    paddingHorizontal: 28,
    paddingVertical: 12,
    marginTop: 27
  },
  btnText: {
    fontFamily: fonts.openSans,
    fontSize: 16,
    letterSpacing: -0.3,
    textAlign: 'center'
  }
})

export default SealedPlaceholder
