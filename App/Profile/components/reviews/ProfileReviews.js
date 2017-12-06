import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import { View, Text, TouchableWithoutFeedback, StyleSheet } from 'react-native'

import utils from '../../../Utility/utils'
import colors from '../../../Common/colors'
import fonts from '../../../Common/fonts'
import SealIcon from '../../../Common/SealIcon'

import { getMyReviews, getPendingReviews, getRating } from '../../reviews.selectors'
import { seeAllReviews } from '../../reviews.actions'

import Stars from './Stars'

let T = utils.translateHelper('reviews')

class ProfileReviews extends Component {
  goToMyReviews = () => {
    this.props.seeAllReviews()
    Actions.reviewsOfMe()
  }

  goToGiveReviews = () => {
    Actions.reviewsToGive()
  }

  render () {
    const { reviews, pending, rating } = this.props
    const numberOfReviews = reviews.filter(r => r.isNew).length
    
    return (
      <View>
        <Text style={styles.sectionTitle}>{T('sectionTitle')}</Text>
        <View style={styles.sectionWrapper}>
          { !!reviews.length
            ? <TouchableWithoutFeedback onPress={this.goToMyReviews}>
              <View style={[styles.reviewItem, {height: 65}]}>
                <View style={{alignSelf: 'center', alignItems: 'center'}}>
                  <Stars rating={rating} />
                  <Text style={styles.reviewInfo}>{
                      `${rating.toPrecision(3)} ${T('rating')}  -  ${reviews.length} ${reviews.length === 1 ? T('review') : T('reviews')}`
                  }</Text>
                </View>
                {
                  numberOfReviews !== 0 &&
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{numberOfReviews}</Text>
                  </View>
                }
                <SealIcon
                  size={16}
                  name='forward'
                  style={styles.fieldIcon}
                  color={colors.lightBlue}
                />
              </View>
            </TouchableWithoutFeedback>
            : <View style={[styles.reviewItem, {height: 65}]}>
              <Text style={{color: colors.placeholderGray}}>{T('noReviews')}</Text>
            </View>
          }
          <TouchableWithoutFeedback onPress={this.goToGiveReviews}>
            <View style={[styles.reviewItem, {borderTopWidth: 1, borderColor: colors.inputBorder, flexDirection: 'row', height: 35}]}>
              <Text style={styles.giveReviewLabel}>{T('giveReview')}</Text>
              { !!pending.length
                ? <View style={styles.badge}>
                  <Text style={styles.badgeText}>{pending.length}</Text>
                </View>
                : null
              }
              <SealIcon
                size={16}
                name='forward'
                style={styles.fieldIcon}
                color={colors.lightBlue}
              />
            </View>
          </TouchableWithoutFeedback>
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

const mapStateToProps = state => ({
  reviews: getMyReviews(state),
  pending: getPendingReviews(state),
  rating: getRating(state)
})

const mapDispatchToProps = dispatch => bindActionCreators({
  seeAllReviews
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ProfileReviews)
