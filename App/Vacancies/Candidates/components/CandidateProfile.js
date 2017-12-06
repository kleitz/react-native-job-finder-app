import React, { Component } from 'react'
import { capitalize } from 'lodash'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Actions } from 'react-native-router-flux'
import { StyleSheet, View, Text, Image, ImageBackground, Dimensions, ScrollView } from 'react-native'

import selectors from '../../vacancies.selectors'
import chatSelectors from '../../../Chat/chat.selectors'

import utils from 'utils/utils'
import fonts from 'common/fonts'
import colors from 'common/colors'
import SealIcon from 'common/SealIcon'
import ImageManager from '../../../Images'

import PastItem from './PastItem'
import ProfileReviews from './ProfileReviews'
import { getEmployeeReviewRequest } from '../../../Profile/reviews.actions'
import { getTemporaryReviews } from '../../../Profile/reviews.selectors'

const getExperienceDuration = (duration) =>
  [0, 1, 2, 3, 4, 5].includes(duration)
    ? T(`experienceLevels.${duration}`)
    : ''

const T = utils.translateHelper(`candidateProfile`)
const { width } = Dimensions.get('window')
class CandidateProfile extends Component {
  componentDidMount () {
    const { getEmployeeReviewRequest, candidate: { id } } = this.props
    getEmployeeReviewRequest(id)
  }
  render () {
    const { candidate, temporaryReviews } = this.props
    let {
      profilePicture, profileHeaderPicture, fullName, shortDescription,
      languages, hasCar, hasLicence, educations, experiences, rating
    } = candidate

    const profilePhoto = profilePicture ? { uri: profilePicture } : ImageManager.common.companyAvatarPlaceholder
    const coverPhoto = profileHeaderPicture ? { uri: profileHeaderPicture } : ImageManager.common.coverPhotoDefault

    return (
      <ScrollView contentContainerStyle={styles.container} style={{ backgroundColor: colors.background }}>
        <ImageBackground style={styles.photoSection} source={coverPhoto}>
          <SealIcon name={'back'} size={16} color={colors.white}
            transclude containerStyle={styles.backIconContainer}
            onPress={Actions.pop}
          />
          <Image style={styles.profilePicture} source={profilePhoto} />
          <Text style={[styles.candidateText, styles.candidateName]}>
            {fullName}
          </Text>
          <Text style={[styles.candidateText, styles.candidateDescription]} numberOfLines={2} ellipsizeMode={'tail'}>
            {shortDescription}
          </Text>
        </ImageBackground>

        <ProfileReviews
          rating={rating}
          employeeId={candidate.id}
          temporaryReviews={temporaryReviews}
          />

        <Text style={styles.sectionHeader}>
          {T('experience')}
        </Text>
        <View style={[styles.detailSection]}>
          {
            experiences.length > 0
              ? experiences.map(({ name, companyName, duration }, i) =>
                <PastItem key={i} index={i} icon={'work'} title={name}
                  place={companyName} time={getExperienceDuration(duration)} />
              )
              : <PastItem index={0} icon={'work'} />
          }
        </View>

        <Text style={styles.sectionHeader}>
          {T('education')}
        </Text>
        <View style={[styles.detailSection]}>
          {
            educations.length > 0
              ? educations.map(({ name, institute, graduationYear }, i) =>
                <PastItem key={i} index={i} icon={'education'} title={name}
                  place={institute} time={graduationYear ? T('graduatedIn', { graduationYear }) : ''} />
              )
              : <PastItem index={0} icon={'education'} />
          }
        </View>
        <Text style={styles.sectionHeader}>
          {T('languageKnowledge')}
        </Text>
        <View style={[styles.detailSection]}>
          {
            Object.entries(languages).length > 0
              ? Object.entries(languages).map((language, i) =>
                <View key={i} style={[styles.profileRow]}>
                  <View style={styles.leftRowContainer}>
                    <Text style={styles.leftProfileText}>
                      {capitalize(language[0])}
                    </Text>
                  </View>
                  <View style={[styles.rightRowContainer, i !== 0 && styles.borderTop]}>
                    <Text style={styles.rightProfileText}>
                      {capitalize(language[1])}
                    </Text>
                  </View>
                </View>
              )
            : <PastItem index={0} icon={'languages'} />
          }
        </View>
        <Text style={styles.sectionHeader}>
          {T('transportation')}
        </Text>
        <View style={styles.detailSection}>
          <View style={styles.profileRow}>
            <View style={styles.leftRowContainer}>
              <Text style={styles.leftProfileText}>{T('car')}</Text>
            </View>
            <View style={styles.rightRowContainer}>
              <Text style={styles.rightProfileText}>{hasCar ? T('yes') : T('no')}</Text>
            </View>
          </View>
          <View style={styles.profileRow}>
            <View style={styles.leftRowContainer}>
              <Text style={styles.leftProfileText}>{T('license')}</Text>
            </View>
            <View style={[styles.rightRowContainer, styles.borderTop]}>
              <Text style={styles.rightProfileText}>{hasLicence ? T('yes') : T('no')}</Text>
            </View>
          </View>
        </View>
        <View style={{ backgroundColor: 'transparent', height: 80, width }} />
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  rightProfileText: {
    paddingRight: 13,
    fontSize: 16,
    fontFamily: fonts.openSansLight,
    letterSpacing: -0.3,
    color: colors.dark
  },
  rightRowContainer: {
    flex: 1,
    height: 42,
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  leftProfileText: {
    paddingLeft: 13,
    fontSize: 16,
    fontFamily: fonts.openSansRegular,
    letterSpacing: -0.3,
    color: colors.dark
  },
  leftRowContainer: {
    width: 80,
    height: 42,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  profileRow: {
    flexDirection: 'row',
    height: 42,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  borderTop: {
    borderTopColor: colors.inputBorder,
    borderTopWidth: 1
  },
  borderBottom: {
    borderBottomColor: colors.inputBorder,
    borderBottomWidth: 1
  },
  detailSection: {
    width,
    backgroundColor: colors.white,
    borderTopColor: colors.inputBorder,
    borderTopWidth: 1,
    borderBottomColor: colors.inputBorder,
    borderBottomWidth: 1
  },
  sectionHeader: {
    marginTop: 23,
    marginBottom: 3,
    fontSize: 14,
    fontFamily: fonts.openSansRegular,
    color: colors.warmGrey,
    textAlign: 'center'
  },
  candidateDescription: {
    fontFamily: fonts.openSansLight,
    fontSize: 14,
    width: width - 22 * 2,
    marginBottom: 12
  },
  candidateText: {
    textAlign: 'center',
    backgroundColor: 'transparent',
    letterSpacing: -0.3,
    color: colors.white
  },
  candidateName: {
    marginTop: 6,
    fontSize: 18,
    fontFamily: fonts.openSansRegular
  },
  profilePicture: {
    marginTop: 35,
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: colors.white
  },
  photoSection: {
    backgroundColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
    width
  },
  backIconContainer: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    position: 'absolute',
    top: 15,
    left: 15,
    width: 50,
    height: 50
  },
  container: {
    backgroundColor: colors.background,
    justifyContent: 'flex-start',
    alignItems: 'center'
  }
})

const mapStateToProps = (state, ownProps) => {
  let futureProps = {
    temporaryReviews: getTemporaryReviews(state)
  }

  if (ownProps.fromChat) {
    futureProps.candidate = chatSelectors.getEmployeeProfile(state)
  } else {
    futureProps.candidate = selectors.candidates.getCandidateInfo(state, ownProps)
  }

  return futureProps
}

const mapDispatchToProps = dispatch => bindActionCreators({
  getEmployeeReviewRequest
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(CandidateProfile)
