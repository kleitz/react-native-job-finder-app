import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

import SealIcon from '../../../Common/SealIcon'
import colors from '../../../Common/colors'
import fonts from '../../../Common/fonts'

import utils from '../../../Utility/utils'

let T = utils.translateHelper('rating')

class Rating extends Component {
  render () {
    const { props: { maxRating = 5, starColor = '#999', setRating, rating } } = this

    return (
      <View>
        <View style={styles.starContainer}>
          {
            Array.from(Array(maxRating)).map((_, i) =>
              <TouchableOpacity key={i} onPress={setRating(i + 1)} activeOpacity={0.8}>
                <SealIcon
                  name={rating >= i + 0.5 ? 'star-filled' : 'star'}
                  size={25}
                  color={starColor}
                  style={[styles.star, i === 0 ? {marginLeft: 0} : null]}
                />
              </TouchableOpacity>
            )
          }
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.hint}>{T('hint1')}</Text>
          <Text style={styles.hint}>{T('hint2')}</Text>
        </View>
      </View>
    )
  }
}

let styles = StyleSheet.create({
  starContainer: {
    flexDirection: 'row',
    padding: 5
  },
  ratingContainer: {
    flexDirection: 'row',
    padding: 5
  },
  star: {
    marginLeft: 20,
    height: 26
  },
  hint: {
    color: colors.lightBlue,
    fontFamily: fonts.openSansRegular,
    fontSize: 14
  }
})

export default Rating
