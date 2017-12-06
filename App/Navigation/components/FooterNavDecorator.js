import React, { Component } from 'react'
import { View } from 'react-native'
import Footer from './Footer'

const wrapper = WrappedComponent =>
  class extends Component {
    render () {
      return (
        <View style={{flex: 1}}>
          <WrappedComponent {...this.props} />
          <Footer parent={this.props.parent} />
        </View>
      )
    }
  }

export default wrapper
