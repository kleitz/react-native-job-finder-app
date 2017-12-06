import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native'

import fonts from 'common/fonts'
import colors from 'common/colors'
import utils from 'utils/utils'
import Images from '../../../Images'

let T = utils.translateHelper('screenCandidates')

const CandidatesPlaceholder = ({isLoading}) => (
  <View style={styles.container}>
    {
      isLoading
        ? <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.lightBlue} size={'large'} />
          <Text style={styles.title}>
            {T('fetchingHint')}
          </Text>
        </View>
        : <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Image source={Images.common.candidatesPlaceholder} style={styles.logo} resizeMode={'contain'} />
          <Text style={styles.title}>{T('noCandidates')}...</Text>
          <Text style={styles.description}>{T('candidatesDescription')}</Text>
        </View>
    }
  </View>
)

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingHorizontal: 30
  },
  logo: {
    width: 110,
    height: 100
  },
  title: {
    fontFamily: fonts.openSansLight,
    fontSize: 20,
    letterSpacing: -0.3,
    color: colors.dark,
    paddingTop: 15,
    textAlign: 'center'
  },
  description: {
    fontFamily: fonts.openSans,
    fontSize: 14,
    letterSpacing: -0.2,
    color: colors.buttonGrey,
    paddingTop: 8,
    textAlign: 'center'
  }
})

export default CandidatesPlaceholder
