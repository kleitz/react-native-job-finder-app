import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Actions } from 'react-native-router-flux'
import {
  Text, View, ScrollView, TextInput, Image, StyleSheet, ActivityIndicator, Alert, Dimensions
} from 'react-native'

import colors from '../../../Common/colors'
import fonts from '../../../Common/fonts'
import SealHeader from '../../../Common/SealHeader'
import Button from '../../../Common/Button'
import Rating from './Rating'

import utils from '../../../Utility/utils'
import { submitReviewRequest, cancelReviewRequest } from '../../reviews.actions'
import { getLoadingReviews } from '../../../Utility/loaders/loaders.selectors'

let T = utils.translateHelper('reviews.giveReviewScreen')

const { width } = Dimensions.get('window')
class GiveReview extends Component {

  constructor (props) {
    super(props)

    this.state = {
      punctuality: 1,
      performance: 1,
      description: ''
    }
  }

  cancel = () => {
    Actions.pop()
  }

  setPunctuality = (rating) => () => {
    this.setState({ punctuality: rating })
  }

  setPerformance = (rating) => () => {
    this.setState({ performance: rating })
  }

  changeText = (text) => {
    this.setState({ description: text })
  }

  acceptSubmit = () => {
    const {
      state: { description, performance, punctuality },
      props: { submitReviewRequest, review: { id } }
    } = this
    submitReviewRequest(id, punctuality, performance, description)
  }

  acceptCancel = () => {
    const { cancelReviewRequest, review: { id } } = this.props
    cancelReviewRequest(id)
  }

  submitReview = () => {
    Alert.alert(
      T('confirmSubmitTitle'),
      T('confirmSubmitMessage'),
      [
        { text: T('yes'), onPress: this.acceptSubmit, style: 'default' },
        { text: T('no'), style: 'cancel' }
      ],
      { cancelable: true }
    )
  }

  cancelReview = () => {
    Alert.alert(
      T('confirmCancelTitle'),
      T('confirmCancelMessage'),
      [
        { text: T('yes'), onPress: this.acceptCancel, style: 'default' },
        { text: T('no'), style: 'cancel' }
      ],
      { cancelable: true }
    )
  }

  render () {
    const { description, performance, punctuality } = this.state
    const { review, loading, submitReviewRequest, cancelReviewRequest } = this.props
    return (
      <View style={styles.container}>
        <SealHeader
          title={T('title')}
          leftBtnText='Cancel'
          leftBtnFn={this.cancel}
        />
        <ScrollView>
          <View style={styles.cardWrapper}>
            <Image
              style={styles.cardPicture}
              source={{uri: review.employee.image || 'https://image.freepik.com/free-vector/best-coffee-house-logo_23-2147498998.jpg'}}
              />
            <View style={{flex: 1}}>
              <Text style={styles.field1}>
                {review.employee.name || 'John Doe'}
              </Text>
              <Text style={styles.field2} numberOfLines={2} ellipsizeMode={'tail'}>
                {review.vacancy.name}
              </Text>
            </View>
          </View>

          <View style={{alignItems: 'center', marginBottom: 30}}>
            <Text style={styles.ratingReason}>{T('ratingReason1')}</Text>
            <Rating
              rating={punctuality}
              starColor={colors.lightBlue}
              setRating={this.setPunctuality}
            />
          </View>
          <View style={{alignItems: 'center', marginBottom: 30}}>
            <Text style={styles.ratingReason}>{T('ratingReason2')}</Text>
            <Rating
              rating={performance}
              starColor={colors.lightBlue}
              setRating={this.setPerformance}
            />
          </View>

          <Text style={styles.inputHint}>{T('inputTextHint')}</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              multiline
              value={description}
              autoCorrect={false}
              style={styles.textInput}
              onChangeText={this.changeText}
              placeholder={T('inputTextPlaceholder')}
              underlineColorAndroid={'transparent'}
            />
          </View>
          <View style={styles.buttonWrapper}>
            {
              loading &&
              <ActivityIndicator color={colors.lightBlue} size={'large'} style={{height: 100}} />
            }
            {
              !loading &&
              <Button
                btnStyle={styles.button}
                onPress={this.submitReview}
                labelStyle={styles.labelBtn}
                >
                {T('submitBtnLabel')}
              </Button>
            }
            {
              !loading &&
              <Button
                onPress={this.cancelReview}
                labelStyle={[styles.labelBtn, { color: colors.lightBlue }]}
                btnStyle={[styles.button, {backgroundColor: 'transparent', borderColor: colors.lightBlue, borderWidth: 1 }]}
                >
                {T('cancelBtnLabel')}
              </Button>
            }
          </View>
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
  cardWrapper: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginVertical: 30,
    padding: 15,
    shadowColor: 'rgba(0,0,0,0.11)',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 1,
    borderRadius: 6,
    flexDirection: 'row',
    elevation: 2
  },
  cardPicture: {
    height: 46,
    width: 46,
    borderRadius: 23,
    marginRight: 15
  },
  field1: {
    color: colors.dark,
    fontFamily: fonts.openSansRegular,
    fontSize: 16
  },
  field2: {
    color: colors.dark,
    fontFamily: fonts.openSansLight,
    fontSize: 16
  },
  inputWrapper: {
    borderColor: colors.inputBorder,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginBottom: 30,
    marginTop: 5
  },
  textInput: {
    textAlignVertical: 'top',
    backgroundColor: colors.white,
    height: 123,
    padding: 5,
    paddingHorizontal: 20,
    fontFamily: fonts.openSansRegular,
    fontSize: 16
  },
  ratingReason: {
    color: colors.warmGrey,
    fontFamily: fonts.openSansRegular,
    fontSize: 14,
    marginBottom: 10
  },
  inputHint: {
    color: colors.warmGrey,
    textAlign: 'center',
    fontFamily: fonts.openSansRegular,
    fontSize: 14,
    width: 280,
    alignSelf: 'center'
  },
  labelBtn: {
    fontFamily: fonts.openSansLight,
    fontSize: 16
  },
  button: {
    width: width - 75 * 2,
    paddingHorizontal: 10,
    alignSelf: 'center',
    marginBottom: 15
  },
  buttonWrapper: {
    marginBottom: 60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loader: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'salmon'
  }
})

const mapState = state => ({
  loading: getLoadingReviews(state)
})

const mapDispatch = dispatch => bindActionCreators({
  submitReviewRequest, cancelReviewRequest
}, dispatch)

export default connect(mapState, mapDispatch)(GiveReview)
