import React, { Component } from 'react'
import moment from 'moment'
import I18n from 'react-native-i18n'
import { View, Text, Image, StyleSheet } from 'react-native'

import colors from '../../../Common/colors'
import fonts from '../../../Common/fonts'
import SealIcon from '../../../Common/SealIcon'
import Stars from './Stars'

import utils from '../../../Utility/utils'

let T = utils.translateHelper('reviews.aboutMe')

class ReviewCard extends Component {
  render () {
    let { review } = this.props

    return (
      <View style={styles.wrapper}>
        <Image source={{uri: review.employee.image}} style={styles.companyLogo} />
        <View style={{flex: 1}}>
          <Text style={styles.companyName}>
            {review.employee.name}
          </Text>
          {
            !!review.description &&
            <Text style={styles.description}>{review.description}</Text>
          }
          <Text style={styles.factorTitle}>{T('vacancyDescription')}</Text>
          <Stars rating={review.scores[0].value} />
          <Text style={styles.factorTitle}>{T('workplace')}</Text>
          <Stars rating={review.scores[1].value} />
          <View style={styles.divider} />
          <View style={{flexDirection: 'row', alignItems: 'center' }}>
            <SealIcon name='work' size={12} color={colors.dark} />
            <Text style={styles.jobTitle}>
              {review.vacancy.name}
            </Text>
          </View>
          
          <Text style={styles.date}>
            {moment(review.vacancy.startDate).locale(I18n.locale.substr(0, 2)).format('MMMM YYYY')}
          </Text>
        </View>
      </View>
    )
  }
}

let styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderTopWidth: 0,
    padding: 15,
    flexDirection: 'row'
  },
  companyLogo: {
    height: 46,
    width: 46,
    borderRadius: 4,
    marginRight: 15
  },
  companyName: {
    color: colors.dark,
    fontFamily: fonts.openSansRegular,
    fontSize: 14
  },
  description: {
    color: colors.dark,
    fontFamily: fonts.openSansLight,
    fontSize: 14
  },
  factorTitle: {
    color: colors.dark,
    fontFamily: fonts.openSansRegular,
    fontSize: 10,
    marginTop: 13,
    marginBottom: 2
  },
  divider: {
    height: 1,
    width: 30,
    backgroundColor: colors.inputBorder,
    marginVertical: 12
  },
  jobTitle: {
    color: colors.dark,
    fontFamily: fonts.openSansRegular,
    fontSize: 14,
    marginLeft: 5
  },
  date: {
    color: colors.placeholderGray,
    fontFamily: fonts.openSansLight,
    fontSize: 12,
    marginTop: 1
  }
})

export default ReviewCard
