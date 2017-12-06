import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import { View, ScrollView, Text, StyleSheet } from 'react-native'

import SealHeader from '../../../Common/SealHeader'
import colors from '../../../Common/colors'
import fonts from '../../../Common/fonts'
import PendingReviewCard from './PendingReviewCard'

import utils from '../../../Utility/utils'
import { getPendingReviews } from '../../reviews.selectors'
import { getInternetStatus } from '../../../Utility/netInfo/netInfo.selectors'

let T = utils.translateHelper('reviews.toGive')

class ReviewsToGive extends Component {
  goBack = () => {
    Actions.pop()
  }

  render () {
    const { reviews, hasInternet } = this.props
    return (
      <View style={styles.container}>
        <SealHeader
          leftBtnText='icon-back'
          leftBtnFn={this.goBack}
          leftIconSize={13}
          title={T('title')} />
        <ScrollView style={{paddingTop: 35}}>
          { reviews.length
            ? reviews.map((review, index) => <PendingReviewCard review={review} key={index} index={index} hasInternet={hasInternet} />)
            : <View style={styles.noReviewsWrapper}>
              <Text style={styles.noReviewsText}>{T('noReviewsText')}</Text>
            </View>
          }
        </ScrollView>
      </View>
    )
  }
}

let styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1
  },
  noReviewsWrapper: {
    backgroundColor: colors.white,
    borderColor: colors.inputBorder,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30
  },
  noReviewsText: {
    color: colors.placeholderGray,
    fontFamily: fonts.openSansRegular,
    fontSize: 16
  }
})

const mapState = state => ({
  reviews: getPendingReviews(state),
  hasInternet: getInternetStatus(state)
})

export default connect(mapState)(ReviewsToGive)
