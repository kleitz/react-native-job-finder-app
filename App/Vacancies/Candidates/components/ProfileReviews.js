import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Actions } from 'react-native-router-flux'
import { View, Text, TouchableWithoutFeedback, StyleSheet } from 'react-native'

import utils from '../../../Utility/utils'
import colors from '../../../Common/colors'
import fonts from '../../../Common/fonts'
import SealIcon from '../../../Common/SealIcon'

import { getEmployeeReviewRequest } from '../../../Profile/reviews.actions'

import Stars from '../../../Profile/components/reviews/Stars'

let T = utils.translateHelper('reviews')

class ProfileReviews extends Component {
  goToMyReviews = () => {
    Actions.employeeReviews({
      isEmployee: true,
      employeeReviews: this.props.temporaryReviews
    })
  }

  render () {
    const { rating: { employeePerformance, employeePunctuality }, temporaryReviews } = this.props
    const candidateRating = (employeePerformance + employeePunctuality) / 2

    return (
      <View style={{flex: 1, alignSelf: 'stretch'}}>
        <Text style={styles.sectionTitle}>{T('sectionTitle')}</Text>
        <View style={styles.sectionWrapper}>
          { !!temporaryReviews.length
            ? <View style={[styles.reviewItem, {height: 65}]}>
              <View style={{alignSelf: 'center', alignItems: 'center'}}>
                <Stars rating={candidateRating} />
                <Text style={styles.reviewInfo}>{
                    `${candidateRating} ${T('rating')}  -  ${temporaryReviews.length} ${temporaryReviews.length === 1 ? T('review') : T('reviews')}`
                }</Text>
              </View>
            </View>
            : <View style={[styles.reviewItem, {height: 65}]}>
              <Text style={{color: colors.placeholderGray}}>{T('noReviews')}</Text>
            </View>
          }
          {
            !!temporaryReviews.length &&
            <TouchableWithoutFeedback onPress={this.goToMyReviews}>
              <View style={[styles.reviewItem, {borderTopWidth: 1, borderColor: colors.inputBorder, flexDirection: 'row', height: 35}]}>
                <Text style={styles.giveReviewLabel}>{T('seeReviews')}</Text>
              </View>
            </TouchableWithoutFeedback>
          }
        </View>
      </View>
    )
  }
}

let styles = StyleSheet.create({
  sectionTitle: {
    color: colors.warmGrey,
    fontFamily: fonts.openSansRegular,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 5
  },
  sectionWrapper: {
    backgroundColor: colors.white,
    borderColor: colors.inputBorder,
    borderWidth: 1
  },
  reviewItem: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  reviewInfo: {
    color: colors.dark,
    fontFamily: fonts.openSansLight,
    fontSize: 14,
    marginTop: 5
  },
  giveReviewLabel: {
    color: colors.lightBlue,
    textAlign: 'center',
    fontFamily: fonts.openSansLight,
    fontSize: 14
  },
  badge: {
    backgroundColor: colors.salmon,
    height: 18,
    width: 18,
    borderRadius: 18,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    right: 30
  },
  badgeText: {
    color: colors.white,
    fontFamily: fonts.openSansSemibold,
    fontSize: 12
  },
  fieldIcon: {
    position: 'absolute',
    right: 10
  }
})

const mapDispatch = dispatch => bindActionCreators({
  getEmployeeReviewRequest
}, dispatch)

export default connect(null, mapDispatch)(ProfileReviews)

