import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import { View, ScrollView, Text, StyleSheet } from 'react-native'

import SealHeader from '../../../Common/SealHeader'
import colors from '../../../Common/colors'
import fonts from '../../../Common/fonts'
import ReviewCard from './ReviewCard'

import utils from '../../../Utility/utils'
import { getMyReviews } from '../../reviews.selectors'

let T = utils.translateHelper('reviews.aboutMe')

class ReviewsOfMe extends Component {
  goBack = () => {
    Actions.pop()
  }

  render () {
    const { reviews, isEmployee, employeeReviews } = this.props
    const revs = isEmployee ? employeeReviews : reviews
    return (
      <View style={styles.container}>
        <SealHeader
          leftBtnText='icon-back'
          leftBtnFn={this.goBack}
          leftIconSize={13}
          title={T('title')}
        />
        <ScrollView>
          { revs.length
            ? revs.map((review, index) => <ReviewCard review={review} key={index} />)
            : <View style={styles.noReviewsWrapper}>
              <Text style={styles.noReviewsTitle}>{T('noReviews')}</Text>
              <Text style={styles.noReviewsHint}>{T('noReviewsHint')}</Text>
            </View>
          }
        </ScrollView>
      </View>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  noReviewsWrapper: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: colors.white,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40
  },
  noReviewsTitle: {
    color: colors.placeholderGray,
    fontFamily: fonts.openSansRegular,
    fontSize: 16,
    marginBottom: 10
  },
  noReviewsHint: {
    color: colors.placeholderGray,
    fontFamily: fonts.openSansRegular,
    fontSize: 12,
    textAlign: 'center'
  }
})

const mapState = state => ({
  reviews: getMyReviews(state)
})

export default connect(mapState)(ReviewsOfMe)
