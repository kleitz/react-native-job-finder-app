import React from 'react'
import I18n from 'react-native-i18n'
import { View, StyleSheet, Image, Text } from 'react-native'

import fonts from '../../Common/fonts'
import colors from '../../Common/colors'
import Button from '../../Common/Button'
import Images from '../../Images'

const MatchModal = ({
  companyUrl, candidatePhoto, candidateName, modalYes, modalNo
}) => {
  let companyLogo = Images.common.companyAvatarPlaceholder

  if (companyUrl) {
    companyLogo = { uri: companyUrl }
  }

  return <View>
    <Text style={[styles.matchText, styles.title]}>
      {I18n.t(`matchModal.title`)}
    </Text>
    <Text style={[styles.matchText, styles.description]}>
      {I18n.t(`matchModal.description`, { candidate: candidateName || 'candidate' })}
    </Text>
    <View style={styles.imageRow}>
      <Image
        style={styles.image}
        source={companyLogo}
        />
      <Image
        style={styles.image}
        source={{uri: candidatePhoto || `https://dummyimage.com/600x400/000/fff`}}
        />
    </View>
    <Button onPress={modalYes} btnStyle={styles.messageButton}>
      {I18n.t(`matchModal.sendMessage`)}
    </Button>
    <Button onPress={modalNo} btnStyle={styles.continueButton}>
      {I18n.t(`matchModal.continueSwiping`)}
    </Button>
  </View>
}

const styles = StyleSheet.create({
  matchText: {
    fontFamily: fonts.openSansLight,
    textAlign: 'center',
    color: colors.white
  },
  title: {
    marginTop: 100,
    fontSize: 30
  },
  description: {
    marginTop: 10,
    fontSize: 14
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 35
  },
  image: {
    width: 90,
    height: 90,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: colors.white
  },
  messageButton: {
    marginTop: 35
  },
  continueButton: {
    marginTop: 35,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.white
  }
})

export default MatchModal
