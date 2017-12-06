import React, { Component } from 'react'
import I18n from 'react-native-i18n'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Actions, ActionConst } from 'react-native-router-flux'
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native'
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view'

import utils from 'utils/utils'
import fonts from 'common/fonts'
import colors from 'common/colors'
import Button from 'common/Button'

import chatSelectors from '../../../Chat/chat.selectors'
import selectors from '../../vacancies.selectors'
import {
  goToMatchedProfile, getMatchingsRequest, clearMatchingsBubbles, stopApplicantCounter,
  sealCandidate, removeCandidate
} from '../matchings.actions'
import { getCandidatesRequest } from '../../Candidates/candidates.actions'

import { getRoomMessagesAndGo, getRooms } from '../../../Chat/chat.actions'
import { getInternetStatus } from '../../../Utility/netInfo/netInfo.selectors'

import Sealed from './Sealed'
import Matched from './Matched'
import ImageManager from '../../../Images'
import VacancyHeader from '../../components/VacancyHeader'

const T = utils.translateHelper('buttons')

class Matchings extends Component {
  backBtnFn = () => {
    const { clearMatchingsBubbles, vacancyId } = this.props
    clearMatchingsBubbles(vacancyId)
    Actions.pop()
  }

  goToChat = (applicant) => () => {
    const { employeeName } = applicant
    const { rooms, hasInternet } = this.props
    const room = rooms
      .find(({employeeFirstName, employeeLastName}) =>
        [employeeFirstName, employeeLastName].join(' ') === employeeName
      )

    if (!room) {
      alert(I18n.t('chatUnavailable'))
    }

    if (hasInternet) {
      this.props.getRoomMessagesAndGo(room.id)
    } else {
      alert(I18n.t(`noInternetConnection`))
    }
  }

  refreshApplicants = () => {
    const { hasInternet, getMatchingsRequest } = this.props
    if (!hasInternet) {
      alert(I18n.t(`noInternetConnection`))
    } else {
      getMatchingsRequest()
    }
  }

  componentDidMount () {
    if (this.props.rooms.length === 0) {
      this.props.getRooms()
    }
  }

  render () {
    const {
      vacancyId, sealed, matched, vacancyDetails, stopApplicantCounter, getCandidatesRequest,
      goToMatchedProfile, getMatchingsRequest, sealCandidate, removeCandidate, hasInternet
    } = this.props

    return (
      <View style={styles.container}>
        <VacancyHeader backBtnFn={this.backBtnFn} details={vacancyDetails[0]} />
        <View style={styles.tabContainer}>
          <ScrollableTabView
            initialPage={0}
            scrollWithoutAnimation={false}
            tabBarTextStyle={styles.tabBarText}
            tabBarBackgroundColor={colors.white}
            tabBarActiveTextColor={colors.lightBlue}
            tabBarInactiveTextColor={colors.warmGrey}
            tabBarUnderlineStyle={styles.tabBarUnderline}
            renderTabBar={() => <DefaultTabBar style={styles.tabs} />}
          >
            <Matched
              tabLabel={'Matched'}
              applicants={matched}
              vacancyId={vacancyId}
              goToChat={this.goToChat}
              hasInternet={hasInternet}
              sealCandidate={sealCandidate}
              goToProfile={goToMatchedProfile}
              removeCandidate={removeCandidate}
              refreshApplicants={this.refreshApplicants}
              stopApplicantCounter={stopApplicantCounter}
              getCandidatesRequest={getCandidatesRequest}
            />
            <Sealed
              tabLabel={'Sealed'}
              applicants={sealed}
              goToChat={this.goToChat}
              hasInternet={hasInternet}
              goToProfile={goToMatchedProfile}
              refreshApplicants={getMatchingsRequest}
            />
          </ScrollableTabView>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  tabContainer: {
    flex: 1
  },
  tabs: {
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignSelf: 'center',
    height: 45,
    borderWidth: 0
  },
  tabBarText: {
    fontFamily: fonts.openSans,
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: -0.3,
    paddingTop: 8
  },
  tabBarUnderline: {
    backgroundColor: colors.lightBlue,
    height: 4,
    transform: [{ translateY: 0 }]
  }
})

const mapStateToProps = (state, { vacancyId }) => ({
  rooms: chatSelectors.getRooms(state),
  hasInternet: getInternetStatus(state),
  sealed: selectors.matchings.getSealedMatchings(state, vacancyId),
  matched: selectors.matchings.getAcceptedMatchings(state, vacancyId),
  vacancyDetails: selectors.vacancies.getVacancyDetails(state, vacancyId)
})

const mapDispatchToProps = dispatch => bindActionCreators({
  goToMatchedProfile,
  getMatchingsRequest,
  clearMatchingsBubbles,
  stopApplicantCounter,
  sealCandidate,
  removeCandidate,
  getRoomMessagesAndGo,
  getCandidatesRequest,
  getRooms
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Matchings)
