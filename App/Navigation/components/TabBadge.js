import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import colors from '../../Common/colors'

export default ({counter}) =>
  !!counter
    ? <View style={styles.badge}>
      <Text style={styles.badgeText}>{counter}</Text>
    </View>
    : null

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.salmon,
    height: 20,
    width: 20,
    borderRadius: 10,
    position: 'absolute',
    top: 2,
    right: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.white,
    borderWidth: 2,
    overflow: 'hidden'
  },
  badgeText: {
    fontSize: 12,
    color: colors.white
  }
})
