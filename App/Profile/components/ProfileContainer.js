import React, { Component } from 'react'
import PropTypes from 'prop-types'
import I18n from 'react-native-i18n'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Dimensions, Platform, StyleSheet, View } from 'react-native'
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view'

import * as profileSelectors from '../profile.selectors'
import { changeFieldsRequest } from '../profile.actions'
import { getSessionError } from '../../Session/session.selectors'
import { logout, logoutRequest } from '../../Session/session.actions'
import { photoRequest } from '../../Utility/photos/photoUpload.actions'
import { getSessionLoader, getProfileLoaders } from '../../Utility/loaders/loaders.selectors'
import { getInternetStatus } from '../../Utility/netInfo/netInfo.selectors'

import About from './About'
import Account from './Account'

import colors from '../../Common/colors'
import fonts from '../../Common/fonts'

class ProfileContainer extends Component {
  static propTypes = {
    logout: PropTypes.func,
    sessionLoader: PropTypes.bool,
    profileLoaders: PropTypes.object
  }

  constructor (props) {
    super(props)

    this.state = {
      selectedTab: 0
    }
  }

  render () {
    const { selectedTab } = this.state
    const {
      sessionLoader, logout, photoRequest, companyInfo, accountInfo, profileLoaders, changeFieldsRequest,
      logoutRequest, sessionError, hasInternetConnection
    } = this.props
    return (
      <View style={{flex: 1}}>
        <ScrollableTabView
          initialPage={selectedTab}
          scrollWithoutAnimation={false}
          tabBarTextStyle={styles.tabBarText}
          tabBarActiveTextColor={colors.white}
          tabBarBackgroundColor={colors.dark}
          tabBarUnderlineStyle={styles.tabBarUnderline}
          tabBarInactiveTextColor={'rgba(255,255,255,0.3)'}
          renderTabBar={() => <DefaultTabBar style={styles.tabs} />}
        >
          <About
            companyInfo={companyInfo}
            photoRequest={photoRequest}
            profileLoaders={profileLoaders}
            changeFields={changeFieldsRequest}
            hasInternet={hasInternetConnection}
            tabLabel={I18n.t('profile.aboutMeTabLabel')}
            />
          <Account
            error={sessionError}
            logout={logoutRequest}
            loader={sessionLoader}
            accountInfo={accountInfo}
            changeFields={changeFieldsRequest}
            hasInternet={hasInternetConnection}
            tabLabel={I18n.t('profile.accountTabLabel')}
          />
        </ScrollableTabView>
      </View>
    )
  }
}

const { width } = Dimensions.get('window')
const underlineDimension = 10

const styles = StyleSheet.create({
  tabs: {
    ...Platform.select({
      ios: {
        height: 75
      },
      android: {
        height: 65
      }
    }),
    borderWidth: 0
  },
  tabBarText: {
    fontFamily: fonts.openSansRegular,
    fontSize: 16,
    fontWeight: '400',
    alignSelf: 'center',
    ...Platform.select({
      ios: {
        transform: [{translateY: 10}]
      },
      android: {
        transform: [{translateY: 5}]
      }
    })
  },
  tabBarUnderline: {
    backgroundColor: colors.white,
    height: 6,
    transform: [{translateY: 0}]
  }
})

const mapStateToProps = state => ({
  sessionError: getSessionError(state),
  sessionLoader: getSessionLoader(state),
  profileLoaders: getProfileLoaders(state),
  hasInternetConnection: getInternetStatus(state),
  companyInfo: profileSelectors.getCompanyInfo(state),
  accountInfo: profileSelectors.getAccountInfo(state)
})

const mapDispatchToProps = dispatch => bindActionCreators({
  logout, photoRequest, changeFieldsRequest, logoutRequest
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ProfileContainer)
