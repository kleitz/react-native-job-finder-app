import React from 'react'
import I18n from 'react-native-i18n'
import { connect } from 'react-redux'
import { View, Text, StyleSheet, Platform, ActivityIndicator } from 'react-native'

import { getInternetStatus, getCodePushStatus } from '../netInfo.selectors'
import colors from '../../../Common/colors'

const decorator = WrappedComponent => ({hasInternet, codePushUpdate, ...rest}) => {
  return <View style={styles.container}>
    {
      !hasInternet &&
      <View style={styles.noInternetBar}>
        <Text style={styles.noInternetText}>
          {I18n.t('noInternetConnection')}
        </Text>
      </View>
    }
    {
      codePushUpdate &&
      <View style={{height: 30, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
        <ActivityIndicator  size={'small'} color={colors.lightBlue} />
        <Text style={{fontFamily: fonts.openSansRegular, fontSize: 16, paddingHorizontal: 10}}>
          {I18n.t('appUpdating')}
        </Text>
      </View>
    }
    <WrappedComponent hasInternet {...rest} />
  </View>
}

const mapStateToProps = state => ({
  hasInternet: getInternetStatus(state),
  codePushUpdate: getCodePushStatus(state)
})

export default (WrappedComponent) => connect(mapStateToProps, null)(decorator(WrappedComponent))

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  noInternetBar: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.warmGrey
  },
  noInternetText: {
    paddingTop: Platform.OS === 'ios' ? 5 : 0,
    color: colors.white,
    fontWeight: '500',
    fontSize: 16
  }
})