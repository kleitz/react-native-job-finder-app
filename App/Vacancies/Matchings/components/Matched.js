import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { partial } from 'lodash'
import I18n from 'react-native-i18n'
import { ScrollView, RefreshControl, StyleSheet } from 'react-native'

import ApplicantCard from './ApplicantCard'
import MatchedPlaceholder from './MatchedPlaceholder'

class Matched extends Component {
  constructor (props) {
    super(props)
    this.state = {
      refreshing: false
    }
  }

  onRefresh () {
    const { refreshApplicants } = this.props
    this.setState({ refreshing: true })
    refreshApplicants()
  }

  componentDidUpdate (prevProps, prevState) {
    const { refreshing } = this.state
    if (refreshing) {
      this.setState({ refreshing: false })
    }
  }

  goToProfile = (vacancyId, employeeId) => () => {
    const { goToProfile, hasInternet } = this.props
    if (!hasInternet) {
      alert(I18n.t(`noInternetConnection`))
    } else {
      goToProfile(vacancyId, employeeId)
    }
  }

  sealCandidate = (vacancyId, employeeId) => () => {
    const { sealCandidate, hasInternet } = this.props
    if (!hasInternet) {
      alert(I18n.t(`noInternetConnection`))
    } else {
      sealCandidate(vacancyId, employeeId)
    }
  }

  removeCandidate = (vacancyId, employeeId) => () => {
    const { removeCandidate, hasInternet } = this.props
    if (!hasInternet) {
      alert(I18n.t(`noInternetConnection`))
    } else {
      removeCandidate(vacancyId, employeeId)
    }
  }

  render () {
    const {
      vacancyId,
      applicants,
      goToChat,
      hasInternet,
      stopApplicantCounter,
      getCandidatesRequest
    } = this.props
    const matchedApplicants = applicants.map((app, i) =>
      <ApplicantCard
        key={i}
        type={'matched'}
        goToChat={goToChat(app)}
        applicant={{ ...app, idx: i }}
        sealCandidate={this.sealCandidate(app)}
        removeCandidate={this.removeCandidate(app)}
        goToProfile={this.goToProfile(app.vacancyId, app.employeeId)}
        stopApplicantCounter={partial(stopApplicantCounter, vacancyId, app.employeeId)}
        />)

    return applicants.length > 0 ? (
      <ScrollView
        style={styles.tabContainer}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh.bind(this)}
          />
        }>
        {matchedApplicants}
      </ScrollView>)
      : (
        <ScrollView
          style={styles.tabContainer}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh.bind(this)}
            />
          }>
          <MatchedPlaceholder vacancyId={vacancyId} hasInternet={hasInternet} getCandidatesRequest={getCandidatesRequest} />
        </ScrollView>
      )
  }
}

Matched.propTypes = {
  applicants: PropTypes.array,
  onSealPress: PropTypes.func,
  removeApplicant: PropTypes.func,
  stopApplicantCounter: PropTypes.func,
  refreshApplicants: PropTypes.func
}

const styles = StyleSheet.create({
  tabContainer: {
    flex: 1,
    flexDirection: 'column'
  }
})

export default Matched
