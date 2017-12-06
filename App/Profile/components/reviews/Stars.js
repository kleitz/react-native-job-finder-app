import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'

import SealIcon from '../../../Common/SealIcon'
import colors from '../../../Common/colors'

class Stars extends Component {
  render () {
    let rating = Math.round(this.props.rating)
    return (
      <View style={styles.wrapper}>
        {
          [1, 2, 3, 4, 5].map((item, index) => {
            if (index + 1 <= rating) {
              return <SealIcon name='star-filled'
                key={index}
                size={13}
                color={colors.lightBlue}
                style={styles.item} />
            } else {
              return <SealIcon name='star'
                key={index}
                size={13}
                color={colors.warmGrey}
                style={styles.item} />
            }
          })
        }
      </View>
    )
  }
}

let styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row'
  },
  item: {
    marginRight: 8,
    height: 14
  }
})

export default Stars
