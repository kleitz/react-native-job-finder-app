import React, { Component } from 'react'
import { Actions } from 'react-native-router-flux'
import {
  View, Text, StyleSheet, TouchableOpacity, Animated, ActivityIndicator, Dimensions
} from 'react-native'

import Carousel from './Carousel'
import colors from '../../Common/colors'
import SignUpButtons from './SignUpButtons'

class InitialScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showStart: true
    }
    this.containerHeight = new Animated.Value(50)
  }

  setStartButtonVisibility = (visibility) => () => {
    this.setState({ showStart: visibility }, () => {
      Animated.timing(
        this.containerHeight,
        {
          toValue: visibility ? 50 : 200,
          duration: 300
        }
      ).start()
    })
  }

  render () {
    const { showStart } = this.state
    return (
      <View style={styles.container}>
        <Carousel animatedHeight={this.containerHeight} />
        <SignUpButtons
          showStart={showStart}
          animatedHeight={this.containerHeight}
          setStartVisibility={this.setStartButtonVisibility}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: colors.backgroundColor
  },
  overlay: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }
})

export default InitialScreen
