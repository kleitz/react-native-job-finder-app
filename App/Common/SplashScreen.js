import React from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'

import colors from './colors'

export default () =>
  <View style={styles.container}>
    <ActivityIndicator color={colors.lightBlue} size={'large'} />
  </View>

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dark
  }
})
