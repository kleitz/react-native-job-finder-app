import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native'

import colors from '../../../Common/colors'
import fonts from '../../../Common/fonts'
import SealIcon from '../../../Common/SealIcon'

class JobCategoryTile extends Component {
  getIconSize = (tileDimension, iconName) => {
    if (!iconName) {
      return tileDimension < 90 ? 25 : 35
    }

    return tileDimension < 90 ? 32 : 42
  }

  render () {
    const { name, selected, index, onSelect, tileMargin, tileDimension, iconName } = this.props

    return (
      <TouchableWithoutFeedback onPress={() => { onSelect(index) }}>
        <View style={[
          styles.tile,
          { marginBottom: tileMargin, height: tileDimension, width: tileDimension },
          tileDimension < 90 && {padding: 3},
          selected && styles.selected,
          (index + 1) % 3 !== 0 && { marginRight: tileMargin }
        ]}>
          <SealIcon
            name={iconName || 'work'}
            color={colors.lightBlue}
            size={this.getIconSize(tileDimension, iconName)}
            style={{height: this.getIconSize(tileDimension, iconName) + 1, marginBottom: 5}} />
          <Text style={[styles.text, tileDimension < 90 && { fontSize: 10 }]}>{name}</Text>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

let styles = StyleSheet.create({
  tile: {
    backgroundColor: colors.white,
    borderColor: colors.inputBorder,
    borderWidth: 1,
    borderRadius: 4,
    height: 100,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5
  },
  selected: {
    borderColor: colors.lightBlue,
    borderWidth: 2
  },
  text: {
    color: colors.dark,
    fontFamily: fonts.openSansRegular,
    fontSize: 12,
    textAlign: 'center'
  }
})

export default JobCategoryTile
