import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet, Image, Platform } from 'react-native'

import Images from '../../Images'
import colors from '../../Common/colors'
import SealIcon from '../../Common/SealIcon'
import { vacancyModalTypes } from '../confirmationModal.constants'

const isVacancyAction = (type) => Object.keys(vacancyModalTypes).includes(type)

const headerAssetSelector = (type, photoUrl) =>
  isVacancyAction(type)
    ? Images.confirmationModal[type]
    : { uri: photoUrl }

const ModalHeader = ({type, photoUrl = 'https://dummyimage.com/600x400/000/ff00d5'}) => {
  const isAction = isVacancyAction(type)
  return (
    <View style={styles.container}>
      <Image
        resizeMode={'contain'}
        source={headerAssetSelector(type, photoUrl)}
        style={[styles.headerIcon, !isAction && styles.roundImage]}
        />
    </View>
  )
}

ModalHeader.propTypes = {
  type: PropTypes.string,
  photoUrl: PropTypes.string
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerIcon: {
    width: 46,
    height: 46
  },
  roundImage: {
    ...Platform.select({
      ios: {
        borderRadius: 22
      },
      android: {
        borderRadius: 500 // I know this is crazy but it's the only way it works on Android
      }
    })
  }
})

export default ModalHeader
