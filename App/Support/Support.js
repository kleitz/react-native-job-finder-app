import React, { Component } from 'react'
import { Image,
  Text,
  View,
  StyleSheet,
  Dimensions,
  Linking,
  TouchableWithoutFeedback
} from 'react-native'

import SealHeader from 'common/SealHeader'
import colors from 'common/colors'
import fonts from 'common/fonts'
import utils from '../Utility/utils'
import assets from '../Images'

let T = utils.translateHelper('support')

let viewport = Dimensions.get('window')

class Support extends Component {
  goTo = (url) => () => {
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url)
        }
      })
  }
  render () {
    return (
      <View style={styles.container}>
        <SealHeader title={T('title')} />
        <View style={styles.row}>
          <TouchableWithoutFeedback onPress={this.goTo('https://www.seal-jobs.com/nl/faq_recruiter')}>
            <View style={styles.item}>
              <Image source={assets.support.faq} style={{width: 34}} resizeMode={'contain'} />
              <Text style={styles.itemText}>FAQ</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={this.goTo('https://www.seal-jobs.com/nl/how_it_works_for_recruiters')}>
            <View style={styles.item}>
              <Image source={assets.support.howItWorks} style={{width: 53}} resizeMode={'contain'} />
              <Text style={styles.itemText}>{T('howItWorks')}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.row}>
          <TouchableWithoutFeedback onPress={this.goTo('https://www.seal-jobs.com/nl/terms_and_conditions')}>
            <View style={styles.item}>
              <Image source={assets.support.termsConditions} style={{width: 49}} resizeMode={'contain'} />
              <Text style={[styles.itemText, { fontSize: 14 }]}>{T('termsConditions')}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  row: {
    flexDirection: 'row'
  },
  item: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: colors.inputBorder,
    height: viewport.width / 2,
    width: viewport.width / 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemText: {
    color: colors.placeholderGray,
    fontFamily: fonts.openSansRegular,
    fontSize: 18,
    textAlign: 'center',
    transform: [{translateY: -10}]
  }
})

export default Support
