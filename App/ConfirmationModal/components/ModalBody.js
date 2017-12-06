import React from 'react'
import { View, StyleSheet, Text } from 'react-native'

import fonts from '../../Common/fonts'
import colors from '../../Common/colors'

const ModalBody = ({title, titleHighlight, description}) => {
  return (
    <View style={[styles.container, !description && { justifyContent: 'center' }]}>
      <Text style={styles.titleText}>
        {title}
        { titleHighlight && (
          <Text style={{fontWeight: 'bold'}}> {titleHighlight}? </Text>
        )}
      </Text>
      {
        !!description &&
        <Text style={styles.descriptionText}>{description}</Text>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 10
  },
  titleText: {
    paddingVertical: 10,
    color: colors.dark,
    fontSize: 16,
    fontFamily: fonts.openSansRegular,
    letterSpacing: -0.3,
    textAlign: 'center'
  },
  descriptionText: {
    fontSize: 12,
    paddingHorizontal: 15,
    fontFamily: fonts.openSansRegular,
    color: colors.placeholderGray,
    textAlign: 'center'
  }
})

export default ModalBody
