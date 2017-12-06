import React, { Component } from 'react'
import I18n from 'react-native-i18n'
import FLAnimatedImage from 'react-native-flanimatedimage'
import { Actions, ActionConst } from 'react-native-router-flux'
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableWithoutFeedback,
  Image
} from 'react-native'

import Swiper from '../../Common/AnimatedSwiper'
import Button from '../../Common/Button'
import colors from '../../Common/colors'
import fonts from '../../Common/fonts'
import Assets from '../../Images'

const { width, height } = Dimensions.get('window')

class Tutorial extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showFinish: false,
      size: { width, height }
    }

    this.nextPage = this.nextPage.bind(this)
    this._onRelease = this._onRelease.bind(this)
    this._onLayoutDidChange = this._onLayoutDidChange.bind(this)
  }

  _onRelease (e, state, context) {
    this.setState({ showFinish: this.refs.swiper.state.index === 3 })
  }

  render () {
    const { showFinish } = this.state
    return (
      <View style={{flex: 1}} onLayout={this._onLayoutDidChange}>
        <Swiper
          ref='swiper'
          loop={false}
          width={this.state.size.width}
          height={this.state.size.height}
          onMomentumScrollEnd={this._onRelease}
          yourNewPageIndex={this.state.currentPage}
          paginationStyle={{top: -this.state.size.height + 90, position: 'absolute'}}
          activeDot={<View style={{backgroundColor: colors.dark, width: 8, height: 8, borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3}} />}
          >
          <View style={{flex: 1}}>
            <View style={styles.textWrapper}>
              <Text style={styles.title}>{I18n.t('tutorial.firstCardTitle')}</Text>
              <Text style={styles.hint}>{I18n.t('tutorial.firstCardDescription')}</Text>
            </View>
            <TouchableWithoutFeedback onPress={() => { Actions.tabs({ type: ActionConst.RESET }) }}>
              <View style={{width: 100, height: 40, position: 'absolute', top: 30, right: 15, alignItems: 'flex-end'}}>
                <Text style={styles.skipBtn}>
                  {I18n.t('buttons.skip')}
                </Text>
              </View>
            </TouchableWithoutFeedback>
            {
              Platform.OS === 'ios'
                ? <FLAnimatedImage
                  style={[styles.image, { bottom: -10 }]}
                  source={Assets.tutorial[Platform.OS].slide1}
                />
                : <Image
                  style={[styles.image, { bottom: -10 }]}
                  source={Assets.tutorial[Platform.OS].slide1}
                />
            }
          </View>
          <View style={{flex: 1}}>
            <View style={styles.textWrapper}>
              <Text style={styles.title}>{I18n.t('tutorial.secondCardTitle')}</Text>
              <Text style={styles.hint}>{I18n.t('tutorial.secondCardDescription')}</Text>
            </View>
            {
              Platform.OS === 'ios'
              ? <FLAnimatedImage
                style={styles.image}
                source={Assets.tutorial[Platform.OS].slide2}
              />
              : <Image
                style={[styles.image, { bottom: -10 }]}
                source={Assets.tutorial[Platform.OS].slide2}
              />
            }
          </View>
          <View style={{flex: 1}}>
            <View style={styles.textWrapper}>
              <Text style={styles.title}>{I18n.t('tutorial.thirdCardTitle')}</Text>
              <Text style={styles.hint}>{I18n.t('tutorial.thirdCardDescription')}</Text>
            </View>
            {
              Platform.OS === 'ios'
              ? <FLAnimatedImage
                style={styles.image}
                source={Assets.tutorial[Platform.OS].slide3}
              />
              : <Image
                style={[styles.image, { bottom: -10 }]}
                source={Assets.tutorial[Platform.OS].slide3}
              />
            }
          </View>
          <View style={{flex: 1}}>
            <View style={styles.textWrapper}>
              <Text style={styles.title}>{I18n.t('tutorial.fourthCardTitle')}</Text>
              <Text style={styles.hint}>{I18n.t('tutorial.fourthCardDescription')}</Text>
            </View>
            {
              Platform.OS === 'ios'
              ? <FLAnimatedImage
                style={styles.image}
                source={Assets.tutorial[Platform.OS].slide4}
              />
              : <Image
                style={[styles.image, { bottom: -10 }]}
                source={Assets.tutorial[Platform.OS].slide4}
              />
            }
          </View>
        </Swiper>
        {
          showFinish
            ? <Button
              opacity={1}
              btnStyle={styles.nextBtn}
              labelStyle={styles.nextBtnLabel}
              onPress={() => { Actions.tabs({ type: ActionConst.RESET }) }}
              >
              {I18n.t('buttons.finish').toUpperCase() + '!'}
            </Button>
            : <Button
              opacity={1}
              onPress={this.nextPage}
              btnStyle={styles.nextBtn}
              labelStyle={styles.nextBtnLabel}
              >
              {I18n.t('buttons.next').toUpperCase()}
            </Button>
        }
      </View>
    )
  }

  nextPage () {
    this.refs.swiper.scrollBy(1)
    if (this.refs.swiper.state.index === 2) {
      this.setState({ showFinish: true })
    }
  }

  _onLayoutDidChange (e) {
    const layout = e.nativeEvent.layout
    this.setState({ size: {
      width: layout.width,
      height: layout.height - (Platform.OS === 'ios' ? 50 : 40)
    } })
  }
}

let styles = StyleSheet.create({
  image: {
    height: height - 30,
    resizeMode: 'contain',
    width: width,
    alignSelf: 'center',
    zIndex: 1
  },
  textWrapper: {
    width: width - 20 * 2,
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 10
  },
  title: {
    fontFamily: fonts.openSansRegular,
    fontSize: 24,
    color: colors.dark,
    marginBottom: 5
  },
  hint: {
    fontFamily: fonts.openSansLight,
    fontSize: 16,
    textAlign: 'center',
    color: colors.dark
  },
  skipBtn: {
    color: colors.lightBlue,
    fontFamily: fonts.openSansRegular,
    fontSize: 16
  },
  nextBtn: {
    backgroundColor: colors.dark,
    borderRadius: 0,
    position: 'absolute',
    ...Platform.select({
      ios: {
        top: height - 50
      },
      android: {
        top: height - 50 - 20
      }
    }),
    height: 50,
    zIndex: 2,
    width: width
  },
  nextBtnLabel: {
    color: colors.white,
    fontFamily: fonts.openSansRegular
  }
})

export default Tutorial
