import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { capitalize } from 'lodash'
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native'

import utils from 'utils/utils'
import colors from 'common/colors'
import fonts from 'common/fonts'
import SealIcon from 'common/SealIcon'
import ImageManager from '../../../Images'
import Stars from '../../../Profile/components/reviews/Stars'

const T = utils.translateHelper('screenCandidates')

const { width, height } = Dimensions.get('window')
const cardHeight = height - 72 - 70 - 20
const CandidateCard = ({ user }) => {
  const {
    address, applied, carDetails, education, experience, fullName, profilePicture,
    profileHeaderPicture, shortDescription, validLanguages, workAddress, rating
  } = user

  let average = 0

  if (rating.employeePerformance && rating.employeePunctuality) {
    average = (rating.employeePerformance + rating.employeePunctuality) / 2
  }

  const profilePhoto = profilePicture ? { uri: profilePicture } : ImageManager.common.companyAvatarPlaceholder
  const coverPhoto = profileHeaderPicture ? { uri: profileHeaderPicture } : ImageManager.common.coverPhotoDefault
  return (
    <View style={styles.candidateCard}>
      <View style={styles.cardHeader}>
        <Image source={coverPhoto} resizeMode={'cover'} style={styles.cardHeaderBg} />
        <View style={styles.cardHeaderInfo}>
          <Image source={profilePhoto} style={styles.userPhoto} />
          <Text style={styles.user}>{fullName}</Text>
          {
            average
            ? <Stars rating={average} />
            : null
          }
        </View>
      </View>
      {
        applied
        ? <View style={styles.appliedBar}>
          <SealIcon name='apply' size={14} color={colors.white} style={{transform: [{translateY: 2}]}} />
          <Text style={styles.appliedText}>Applied</Text>
        </View>
        : null
      }
      <View style={styles.cardBody}>
        <View style={styles.bodyRow}>
          <Text style={[styles.bodyText]} numberOfLines={2} ellipsizeMode={'tail'}>
            {shortDescription}
          </Text>
        </View>
        <View style={styles.bodyRow}>
          <SealIcon name={'location'} size={20} style={styles.bodyRowIcon} />
          {
            !!workAddress
              ? <Text style={styles.bodyText} numberOfLines={1} ellipsizeMode={'tail'}>
                {workAddress}
              </Text>
              : <Text style={[styles.bodyText, { color: colors.placeholderGray }]}>
                {T('noLocation')}
              </Text>
          }
        </View>
        <View style={styles.bodyRow}>
          <SealIcon name={'work'} size={17} style={styles.bodyRowIcon} />
          {
            !!experience
              ? <Text style={[styles.bodyText, { fontFamily: fonts.openSans }]} numberOfLines={1} ellipsizeMode={'tail'}>
                {experience.name} <Text style={{ fontFamily: fonts.openSansLight }}> - {experience.companyName}</Text>
              </Text>
              : <Text style={[styles.bodyText, { color: colors.placeholderGray }]}>
                {T('noExperience')}
              </Text>
          }
        </View>
        <View style={styles.bodyRow}>
          <SealIcon name={'education'} size={16} style={styles.bodyRowIcon} />
          {
            !!education
              ? <Text style={[styles.bodyText, { fontFamily: fonts.openSans }]} numberOfLines={1} ellipsizeMode={'tail'}>
                {education.name} <Text style={{ fontFamily: fonts.openSansLight }}> - {education.institute}</Text>
              </Text>
              : <Text style={[styles.bodyText, { color: colors.placeholderGray }]}>
                {T('noExperience')}
              </Text>
          }
        </View>
      </View>
      <View style={styles.bodyFooter}>
        <View style={[styles.footerBox, { borderRightWidth: 1, borderColor: colors.inputBorder }]}>
          <SealIcon name={'languages'} size={17} style={[styles.bodyRowIcon, styles.bodyFooterIcon]} />
          <Text style={[styles.bodyText, styles.bodyFooterText]} numberOfLines={1} ellipsizeMode={'tail'}>
            {validLanguages || T('noLanguages')}
          </Text>
        </View>
        <View style={styles.footerBox}>
          <SealIcon name={'car'} size={18} style={[styles.bodyRowIcon, styles.bodyFooterIcon]} />
          <Text style={[styles.bodyText, styles.bodyFooterText]} numberOfLines={1} ellipsizeMode={'tail'}>
            {carDetails}
          </Text>
        </View>
      </View>
    </View>
  )
}

CandidateCard.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    location: PropTypes.string,
    experience: PropTypes.object,
    education: PropTypes.object,
    photo: PropTypes.any
  })
}

const styles = StyleSheet.create({
  candidateCard: {
    width: width - 16 * 2,
    height: cardHeight - 40,
    flexDirection: 'column',
    backgroundColor: colors.white,
    borderRadius: 4,
    shadowColor: 'rgba(0,0,0, 0.5)',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowRadius: 2,
    shadowOpacity: 0.27,
    elevation: 1,
    // borderColor: colors.inputBorder,
    // borderWidth: 1,
    marginLeft: 16
  },
  cardHeader: {
    height: 165,
    alignItems: 'center',
    borderTopRightRadius: 4,
    borderTopLeftRadius: 4,
    overflow: 'hidden'
  },
  cardHeaderBg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    width: null,
    height: null,
    borderTopRightRadius: 4,
    borderTopLeftRadius: 4
  },
  cardHeaderInfo: {
    backgroundColor: 'transparent',
    position: 'absolute',
    marginTop: 20
  },
  userPhoto: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: colors.white
  },
  user: {
    fontFamily: fonts.openSansSemibold,
    fontSize: 18,
    color: colors.white,
    letterSpacing: -0.3,
    textAlign: 'center'
  },
  cardBody: {
    flex: 1,
    paddingTop: 5
  },
  bodyRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18
  },
  bodyRowIcon: {
    flex: 0.1,
    color: colors.lightBlue,
    height: 21
  },
  bodyText: {
    flex: 0.9,
    fontFamily: fonts.openSansLight,
    fontSize: 14,
    color: colors.dark
  },
  bodyFooter: {
    height: 50,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: colors.inputBorder,
    padding: 0
  },
  footerBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bodyFooterText: {
    textAlign: 'center',
    flex: 0.75
  },
  bodyFooterIcon: {
    flex: 0.25,
    textAlign: 'right'
  },
  appliedBar: {
    backgroundColor: colors.lightBlue,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 5
  },
  appliedText: {
    color: colors.white,
    fontFamily: fonts.openSans,
    fontSize: 16,
    marginLeft: 5
  }
})

export default CandidateCard
