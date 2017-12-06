import React from 'react'
import I18n from 'react-native-i18n'
import { View, Image, Dimensions, Text, StyleSheet, Platform } from 'react-native'

import assetManager from '../../Images'
import fonts from '../../Common/fonts'
import colors from '../../Common/colors'
import AnimatedSwiper from '../../Common/AnimatedSwiper'

import Config from 'react-native-config'

const assets = Platform.OS === 'ios'
  ? assetManager.startCarousel.ios
  : assetManager.startCarousel.android

const { width, height } = Dimensions.get('window')
const TEXT_HOLDER_WIDTH = 250
const leftPos = width / 2 - TEXT_HOLDER_WIDTH / 2
export default ({animatedHeight}) =>
  <View style={{flex: 1}}>
    <AnimatedSwiper
      animatedBottom={animatedHeight}
      height={Platform.OS === 'ios' ? height : height - 20}
      activeDot={<View style={{backgroundColor: colors.white, width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}} />}
      >
      <View>
        <View style={styles.textHolder}>
          <Text style={[styles.titleText, styles.textShadow]}>
            {I18n.t(`carousel.slide1Title`)}
          </Text>
          <Text style={[styles.captionText, styles.textShadow]}>
            {I18n.t(`carousel.slide1Description`)}
          </Text>
        </View>
        <Image
          resizeMode={'stretch'}
          style={{width, height}}
          source={assets.slide1}
          />
      </View>
      <View>
        <View style={styles.textHolder}>
          <Text style={[styles.titleText, styles.textShadow]}>
            {I18n.t(`carousel.slide2Title`)}
          </Text>
          <Text style={[styles.captionText, styles.textShadow]}>
            {I18n.t(`carousel.slide2Description`)}
          </Text>
        </View>
        <Image
          resizeMode={'stretch'}
          style={{width, height}}
          source={assets.slide2}
          />
      </View>
      <View>
        <View style={styles.textHolder}>
          <Text style={[styles.titleText, styles.textShadow]}>
            {I18n.t(`carousel.slide3Title`)}
          </Text>
          <Text style={[styles.captionText, styles.textShadow]}>
            {I18n.t(`carousel.slide3Description`)}
          </Text>
        </View>
        <Image
          resizeMode={'stretch'}
          style={{width, height}}
          source={assets.slide3}
          />
      </View>
      <View>
        <View style={styles.textHolder}>
          <Text style={[styles.titleText, styles.textShadow]}>
            {I18n.t(`carousel.slide4Title`)}
          </Text>
          <Text style={[styles.captionText, styles.textShadow]}>
            {I18n.t(`carousel.slide4Description`)}
          </Text>
        </View>
        <Image
          resizeMode={'stretch'}
          style={{width, height}}
          source={assets.slide4}
          />
      </View>
    </AnimatedSwiper>
  </View>

const styles = StyleSheet.create({
  textHolder: {
    marginBottom: 40,
    width: TEXT_HOLDER_WIDTH,
    zIndex: 1000,
    bottom: 70,
    left: leftPos,
    position: 'absolute'
  },
  titleText: {
    fontSize: 28,
    textAlign: 'center',
    lineHeight: 29,
    letterSpacing: -0.5,
    fontFamily: fonts.openSansLight,
    color: colors.white
  },
  captionText: {
    fontSize: 14,
    textAlign: 'center',
    letterSpacing: -0.2,
    fontFamily: fonts.openSansLight,
    color: colors.white
  },
  textShadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {
      width: 2, height: 0
    },
    textShadowRadius: 4
  }
})
