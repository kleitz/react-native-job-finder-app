import React, { Component } from 'react'
import PropTypes from 'prop-types'
import I18n from 'react-native-i18n'
import { connect } from 'react-redux'
import { Actions, ActionConst } from 'react-native-router-flux'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

import TabBadge from './TabBadge'
import colors from '../../Common/colors'
import SealIcon from '../../Common/SealIcon'

import selectors from '../../Vacancies/vacancies.selectors'
import chatSelectors from '../../Chat/chat.selectors'
import { getProfileBadge } from '../../Profile/reviews.selectors'
import { getInternetStatus } from '../../Utility/netInfo/netInfo.selectors'

class Footer extends Component {
  goToTab = (tab, type = ActionConst.REFRESH) => () => {
		// Actions[tab]({ type })
		// console.log(tab)
		if(tab === "vacanciesTab") {
			Actions.vacanciesTab();
		}else if(tab === "chatTab") {
			Actions.chatTab();
		}else if(tab === "helpTab") {
			Actions.helpTab();
		}else {
			Actions.profileTab();
		}
  }

  goToCreate = () => {
    const { hasInternet } = this.props
    if (!hasInternet) {
      alert(I18n.t(`noInternetConnection`))
    } else {
      Actions.nvJobTitle()
    }
  }

  isTabSelected = (parent) => this.props.parent === parent

  render () {
    const { vacancyBadge, chatBadge, profileBadge } = this.props
    return (
      <View style={styles.navbar}>
        <TouchableOpacity onPress={this.goToTab('vacanciesTab')} style={styles.tabButton} activeOpacity={0.8}>
          <SealIcon
            size={23}
            name={'applications'}
            style={styles.buttonIcon}
            color={this.isTabSelected('vacanciesTab') ? colors.lightBlue : colors.warmGrey}
            />
          <Text style={[styles.buttonText, this.isTabSelected('vacanciesTab') && {color: colors.lightBlue}]}>
            {I18n.t('footerTabs.vacancies')}
          </Text>
          <TabBadge counter={vacancyBadge} />
        </TouchableOpacity>
        <TouchableOpacity onPress={this.goToTab('chatTab')} style={styles.tabButton} activeOpacity={0.8}>
          <SealIcon
            size={23}
            name={'chat'}
            style={styles.buttonIcon}
            color={this.isTabSelected('chatTab') ? colors.lightBlue : colors.warmGrey}
            />
          <Text style={[styles.buttonText, this.isTabSelected('chatTab') && {color: colors.lightBlue}]}>
            {I18n.t('footerTabs.chat')}
          </Text>
          <TabBadge counter={chatBadge} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.addButton} onPress={this.goToCreate}>
          <SealIcon name={'add'} color={colors.white} style={styles.addButtonText} />
        </TouchableOpacity>

        <TouchableOpacity onPress={this.goToTab('helpTab')} style={styles.tabButton} activeOpacity={0.8}>
          <SealIcon
            size={23}
            name={'howitworks'}
            style={styles.buttonIcon}
            color={this.isTabSelected('helpTab') ? colors.lightBlue : colors.warmGrey}
            />
          <Text style={[styles.buttonText, this.isTabSelected('helpTab') && {color: colors.lightBlue}]}>
            {I18n.t('footerTabs.help')}
          </Text>
          <TabBadge counter={0} />
        </TouchableOpacity>
        <TouchableOpacity onPress={this.goToTab('profileTab')} style={styles.tabButton} activeOpacity={0.8}>
          <SealIcon
            size={23}
            name={'profile'}
            style={styles.buttonIcon}
            color={this.isTabSelected('profileTab') ? colors.lightBlue : colors.warmGrey}
            />
          <Text style={[styles.buttonText, this.isTabSelected('profileTab') && {color: colors.lightBlue}]}>
            {I18n.t('footerTabs.profile')}
          </Text>
          <TabBadge counter={profileBadge} />
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  addButtonText: {
    fontSize: 24
  },
  addButton: {
    height: 53,
    width: 64,
    backgroundColor: colors.lightBlue,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    paddingVertical: 2,
    fontSize: 12,
    color: colors.warmGrey
  },
  buttonIcon: {
    height: 24
  },
  tabButton: {
    flex: 1,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center'
  },
  navbar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    backgroundColor: colors.white,
    borderColor: colors.inputBorder
  }
})

Footer.propTypes = {
  parent: PropTypes.string
}

const mapStateToProps = state => ({
  profileBadge: getProfileBadge(state),
  hasInternet: getInternetStatus(state),
  chatBadge: chatSelectors.getBadgeCounter(state),
  vacancyBadge: selectors.getVacancyTabBadges(state)
})

export default connect(mapStateToProps)(Footer)
