import React, { Component } from 'react'
import PropTypes from 'prop-types'
import I18n from 'react-native-i18n'
import { partial } from 'lodash'
import { Actions } from 'react-native-router-flux'
import { ScrollView, RefreshControl, Text, StyleSheet, Image, Platform, TouchableWithoutFeedback } from 'react-native'

import utils from 'utils/utils'
import colors from 'common/colors'
import fonts from 'common/fonts'
import Button from 'common/Button'
import SealIcon from 'common/SealIcon'

import ApplicantCard from './ApplicantCard'
import SealedPlaceholder from './SealedPlaceholder'

class Sealed extends Component {
  constructor(props) {
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

  render() {
    const { applicants, refreshApplicants, goToChat } = this.props
    const sealedApplicants = applicants.map((app, i) =>
        <ApplicantCard
          key={i}
          applicant={app}
          type={'sealed'}
          goToChat={goToChat(app)}
          goToProfile={this.goToProfile(app.vacancyId, app.employeeId)}
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
        {sealedApplicants}
      </ScrollView>) : (
      <ScrollView
        style={styles.tabContainer}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh.bind(this)}
          />
        }>
        <SealedPlaceholder />
      </ScrollView>
      )
  }
}

Sealed.propTypes = {
  applicants: PropTypes.array,
  refreshApplicants: PropTypes.func
}

const styles = StyleSheet.create({
  tabContainer: {
    flex: 1,
    flexDirection: 'column'
  }
})

export default Sealed
