import React, { Component } from 'react'
import PropTypes from 'prop-types'
import I18n from 'react-native-i18n'
import { Actions } from 'react-native-router-flux'
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native'

import utils from 'utils/utils'
import fonts from 'common/fonts'
import colors from 'common/colors'
import Button from 'common/Button'
import Images from '../../../Images'

const T = utils.translateHelper('manageApplicants')

const MatchedPlaceholder = ({ vacancyId, hasInternet, getCandidatesRequest }) => (
  <View style={styles.container}>
    <Image source={Images.common.matchedPlaceholder} style={styles.logo} resizeMode={'contain'} />
    <Text style={styles.title}>{T('noMatches')}...</Text>
    <Text style={styles.description}>{T('matchDescription')}</Text>
    <Button
      btnStyle={styles.btnStyle}
      labelStyle={styles.btnText}
      onPress={() => {
        if (!hasInternet) {
          I18n.t(`noInternetConnection`)
        } else {
          getCandidatesRequest(vacancyId)
        }
      }}>{T('matchButtonText')}</Button>
  </View>
)

const width = Dimensions.get('window').width

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingHorizontal: 25
  },
  logo: {
    width: 115,
    height: 105,
    marginTop: 90,
    marginLeft: 10
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
    color: colors.warmGrey,
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

export default MatchedPlaceholder
