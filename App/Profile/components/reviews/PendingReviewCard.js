import React, { Component } from 'react'
import I18n from 'react-native-i18n'
import { Actions } from 'react-native-router-flux'
import { View, Text, Image, StyleSheet, TouchableWithoutFeedback } from 'react-native'

import colors from '../../../Common/colors'
import fonts from '../../../Common/fonts'
import SealIcon from '../../../Common/SealIcon'

class PendingReviewCard extends Component {
  goToPendingReview = () => {
    const { hasInternet } = this.props
    if (!hasInternet) {
      alert(I18n.t(`noInternetConnection`))
    } else {
      Actions.giveReview({review: this.props.review})
    }
  }

  render () {
    let { review, index } = this.props
    return (
      <TouchableWithoutFeedback onPress={this.goToPendingReview}>
        <View style={[styles.wrapper, index === 0 ? { borderTopWidth: 1 } : null]}>
          <Image source={{uri: review.employee.image}} style={styles.companyLogo} />
          <View style={{flex: 1}}>
            <Text style={styles.jobTitle}>
              {review.vacancy.name}
            </Text>
            <Text style={styles.company}>{review.employee.name}</Text>
          </View>
          <SealIcon
            size={16}
            name='forward'
            color={colors.lightBlue}
          />
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

let styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.white,
    borderColor: colors.inputBorder,
    flexDirection: 'row',
    borderBottomWidth: 1,
    padding: 15,
    alignItems: 'center'
  },
  companyLogo: {
    height: 46,
    width: 46,
    borderRadius: 23,
    marginRight: 15
  },
  jobTitle: {
    color: colors.dark,
    fontFamily: fonts.openSansRegular,
    fontSize: 16
  },
  company: {
    color: colors.dark,
    fontFamily: fonts.openSansLight,
    fontSize: 16
  }
})

export default PendingReviewCard
