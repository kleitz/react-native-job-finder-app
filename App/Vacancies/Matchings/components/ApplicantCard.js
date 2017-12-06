import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Text, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native'

import colors from 'common/colors'
import fonts from 'common/fonts'
import SealIcon from 'common/SealIcon'
import ImageManager from '../../../Images'

import ApplicantCardActions from './ApplicantCardActions'

class ApplicantCard extends Component {
  state = {
    expired: false
  }

  handleCounterEnd = () => {
    this.props.stopApplicantCounter()
  }

  render () {
    const {
      applicant,
      type,
      sealCandidate,
      removeCandidate,
      goToProfile,
      goToChat
    } = this.props

    const {
      employeeName,
      employeeProfilePicture,
      showBubble,
      employeeMobile
    } = applicant
    const imageSrc = employeeProfilePicture ? { uri: employeeProfilePicture } : ImageManager.common.companyAvatarPlaceholder

    return (
      <TouchableWithoutFeedback onPress={goToProfile}>
        <View style={[styles.card, { height: 102 }]}>
          <View style={[styles.content, { flex: 0.6 }]}>
            {
              showBubble && <View style={styles.redDot} />
            }
            <View style={styles.photo}>
              <Image source={imageSrc} style={styles.userPhoto} />
            </View>
            <View style={styles.info}>
              <Text style={styles.user}>{employeeName}</Text>
              {
                type === 'sealed' && (
                  <View style={styles.sealed}>
                    <Text style={styles.sealedText}>Sealed</Text>
                    <SealIcon size={16} name={'medal'} color={colors.lightBlue} />
                  </View>
                )
              }
              {
                type === 'matched' && (
                  <TouchableWithoutFeedback onPress={removeCandidate}>
                    <View style={styles.remove}>
                      <SealIcon name={'skip'} color={colors.warmGrey} size={11} />
                    </View>
                  </TouchableWithoutFeedback>
                )
              }
            </View>
          </View>
          <ApplicantCardActions
            type={type}
            goToChat={goToChat}
            phoneNumber={employeeMobile}
            sealCandidate={sealCandidate}
          />
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

ApplicantCard.propTypes = {
  details: PropTypes.object,
  type: PropTypes.string,
  removeApplicant: PropTypes.func,
  stopApplicantCounter: PropTypes.func,
  onSealPress: PropTypes.func
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'column',
    marginTop: 15,
    backgroundColor: colors.white,
    borderRadius: 6,
    shadowColor: 'rgb(0,0,0)',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 4,
    shadowOpacity: 0.11,
    marginHorizontal: 15
  },
  content: {
    flexDirection: 'row',
    padding: 8
  },
  redDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: colors.salmon,
    position: 'absolute',
    left: 7,
    top: 7
  },
  userPhoto: {
    width: 45,
    height: 45,
    borderRadius: 23,
    overflow: 'hidden'
  },
  user: {
    fontFamily: fonts.openSans,
    fontSize: 16,
    color: colors.dark,
    paddingTop: 3
  },
  photo: {
    flex: 0.25,
    alignItems: 'center',
    justifyContent: 'center'
  },
  info: {
    flex: 0.75,
    flexDirection: 'column',
    paddingLeft: 5,
    justifyContent: 'center',
    alignSelf: 'center'
  },
  remove: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    width: 30,
    height: 40
  },
  btnText: {
    fontFamily: fonts.openSans,
    fontSize: 14,
    color: colors.lightBlue,
    textAlign: 'center'
  },
  sealed: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  sealedText: {
    fontFamily: fonts.openSansLight,
    fontSize: 14,
    color: colors.lightBlue,
    paddingRight: 5
  }
})

export default ApplicantCard
