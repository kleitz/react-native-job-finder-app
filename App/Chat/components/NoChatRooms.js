import React from 'react'
import I18n from 'react-native-i18n'
import { Actions } from 'react-native-router-flux'
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native'

import fonts from '../../Common/fonts'
import colors from '../../Common/colors'
import IconButton from '../../Common/IconButton'
import Assets from '../../Images'

const { width } = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1
  },
  button: {
    justifyContent: 'center',
    marginTop: 33,
    minWidth: 140,
    height: 36,
    paddingHorizontal: 24
  },
  buttonText: {
    fontFamily: fonts.openSansRegular,
    fontSize: 14,
    paddingLeft: 5
  },
  image: {
    width: 90,
    height: 98,
    marginTop: 52
  },
  title: {
    width,
    height: 27,
    marginTop: 20,
    fontSize: 20,
    fontFamily: fonts.openSansLight,
    textAlign: 'center',
    color: colors.dark,
    letterSpacing: -0.3
  },
  text: {
    textAlign: 'center',
    color: colors.placeholderGray,
    fontFamily: fonts.openSansRegular,
    fontSize: 14,
    letterSpacing: -0.2,
    width: width - 40 * 2,
    marginTop: 7
  }
})

const NoChatRooms = () =>
  <View style={styles.container}>
    <Image
      style={styles.image}
      resizeMode={'contain'}
      source={Assets.common.noConnectionsPlaceholder}
    />
    <Text style={styles.title}>
      {I18n.t('chat.noConnectionsTitle')}
    </Text>
    <Text style={styles.text}>
      {I18n.t('chat.noJobConnections')}
    </Text>
    <IconButton
      iconSize={12}
      activeOpacity={0.7}
      iconName='find-jobs'
      style={styles.button}
      iconStyle={styles.buttonIcon}
      labelStyle={styles.buttonText}
      label={I18n.t('chat.lookForJobsButton')}
      onPress={() => { Actions.vacanciesTab() }}
    />
  </View>

export default NoChatRooms
