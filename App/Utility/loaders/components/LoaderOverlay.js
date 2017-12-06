import React from 'react'
import { connect } from 'react-redux'
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'

import colors from 'common/colors'
import { getLoadingOverlay } from '../loaders.selectors'

const decorator = WrappedComponent => ({isLoading, ...rest}) => {
  return <View style={styles.container}>
    <WrappedComponent isLoading {...rest} />
    {
      isLoading &&
      <View style={styles.overlay}>
        <ActivityIndicator color={colors.lightBlue} size={'large'} />
      </View>
    }
  </View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  overlay: {
    zIndex: 10,
    elevation: 2,
    backgroundColor: '#444',
    opacity: 0.7,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

const mapStateToProps = state => ({
  isLoading: getLoadingOverlay(state)
})

export default (WrappedComponent) => connect(mapStateToProps)(decorator(WrappedComponent))
