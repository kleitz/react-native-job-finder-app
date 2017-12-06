import React, { Component } from 'react'
import PropTypes from 'prop-types'
import I18n from 'react-native-i18n'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Animatable from 'react-native-animatable'
import { View, Text, StyleSheet, Image, TouchableWithoutFeedback, Animated } from 'react-native'

import utils from 'utils/utils'
import fonts from 'common/fonts'
import colors from 'common/colors'
import SealIcon from 'common/SealIcon'
import VacancyDate from './VacancyDate'
import VacancyMenu from './VacancyMenu'
import ImageManager from '../../../Images'
import Candidates from './VacancyCandidates'

import selectors from '../../vacancies.selectors'
import { getCandidatesRequest } from '../../Candidates/candidates.actions'
import { getInternetStatus } from '../../../Utility/netInfo/netInfo.selectors'

let T = utils.translateHelper('vacancy')

const MENU_ITEM_HEIGHT = 65
const MAIN_CONTENT_HEIGHT = 125
const MAIN_CONTENT_COLLAPSED_HEIGHT = 85
const CANDIDATES_HEIGHT = 30
const CANDIDATES_ITEM_HEIGHT = 26
const DURATION = 300
const MENU_ITEMS = {
  ACTIVE: 4,
  PAUSED: 3,
  EXPIRED: 1
}

class VacancyCard extends Component {
  constructor (props) {
    super(props)

    this.state = {
      collapsed: true,
      expandedMenuHeight: new Animated.Value(0),
      menuItemHeight: new Animated.Value(0),
      mainContentHeight: new Animated.Value(MAIN_CONTENT_HEIGHT),
      candidatesHeight: new Animated.Value(CANDIDATES_HEIGHT),
      candidatesItemHeight: new Animated.Value(CANDIDATES_ITEM_HEIGHT)
    }
  }

  toggleVacancyDetails = () => {
    const { vacancy } = this.props
    if (!vacancy.selected) {
      this.expandMenu()
    } else {
      this.collapseMenu()
    }
  }

  expandMenu = () => {
    const { cardIndex, onVacancyPress, vacancy } = this.props
    const { collapsed } = this.state
    const menuItems = MENU_ITEMS[`${vacancy.state.toLocaleUpperCase()}`]
    onVacancyPress(cardIndex)
    collapsed && Animated.sequence([
      Animated.parallel([
        Animated.timing(this.state.mainContentHeight, {
          toValue: MAIN_CONTENT_COLLAPSED_HEIGHT,
          duration: DURATION
        }),
        Animated.timing(this.state.candidatesHeight, {
          toValue: 0,
          duration: DURATION
        }),
        Animated.timing(this.state.candidatesItemHeight, {
          toValue: 0,
          duration: DURATION
        })
      ]),
      Animated.parallel([
        Animated.timing(this.state.expandedMenuHeight, {
          toValue: MENU_ITEM_HEIGHT * menuItems,
          duration: DURATION
        }),
        Animated.timing(this.state.menuItemHeight, {
          toValue: MENU_ITEM_HEIGHT,
          duration: DURATION
        })
      ])
    ]).start(() => { this.setState({collapsed: false}) })
  }

  collapseMenu = (fn) => {
    const { onVacancyPress } = this.props

    Animated.sequence([
      Animated.parallel([
        Animated.timing(this.state.expandedMenuHeight, {
          toValue: 0,
          duration: fn ? 100 : DURATION
        }),
        Animated.timing(this.state.menuItemHeight, {
          toValue: 0,
          duration: fn ? 100 : DURATION
        })
      ]),
      Animated.parallel([
        Animated.timing(this.state.mainContentHeight, {
          toValue: MAIN_CONTENT_HEIGHT,
          duration: fn ? 100 : 200
        }),
        Animated.timing(this.state.candidatesHeight, {
          toValue: CANDIDATES_HEIGHT,
          duration: fn ? 100 : 400
        }),
        Animated.timing(this.state.candidatesItemHeight, {
          toValue: CANDIDATES_ITEM_HEIGHT,
          duration: fn ? 100 : 400
        })
      ])
    ]).start(() => {
      onVacancyPress(-1)
      this.setState({collapsed: true})
      fn && setTimeout(() => {
        fn()
      }, 10)
    })
  }

  onPausePress = () => {
    const { hasInternet } = this.props
    if (!hasInternet) {
      alert(I18n.t(`noInternetConnection`))
    } else {
      this.collapseMenu(this.props.onPauseVacancy)
    }
  }

  onResumePress = () => {
    const { hasInternet } = this.props
    if (!hasInternet) {
      alert(I18n.t(`noInternetConnection`))
    } else {
      this.collapseMenu(this.props.onResumeVacancy)
    }
  }

  onEditPress = () => {
    const { hasInternet } = this.props
    if (!hasInternet) {
      alert(I18n.t(`noInternetConnection`))
    } else {
      this.collapseMenu(this.props.onEditVacancy)
    }
  }

  onReusePress = () => {
    const { hasInternet } = this.props
    if (!hasInternet) {
      alert(I18n.t(`noInternetConnection`))
    } else {
      this.collapseMenu(this.props.onReuseVacancy)
    }
  }

  badgeNumber = () => {
    const { pendingMatchings, bubbledMatchings } = this.props
    return pendingMatchings.length + bubbledMatchings.length
  }

  goToCandidates = (vacancyId) => () => {
    const { getCandidatesRequest, hasInternet } = this.props
    if (!hasInternet) {
      alert(I18n.t(`noInternetConnection`))
    } else {
      getCandidatesRequest(vacancyId)
    }
  }

  render () {
    const { id: vacancyId, name, address, shouldAnimate, headerImageUrl, schedules, state, selected } = this.props.vacancy
    const {
      goTo,
      acceptedMatchings,
      sealedMatchings,
      pendingMatchings,
      bubbledMatchings
    } = this.props

    const { menuItemHeight, expandedMenuHeight, mainContentHeight, candidatesHeight, candidatesItemHeight } = this.state
    const imageSrc = headerImageUrl ? { uri: headerImageUrl } : ImageManager.common.companyAvatarPlaceholder
    const vacancyCardHeight = selected ? mainContentHeight : MAIN_CONTENT_HEIGHT
    const canditatesH = selected ? candidatesHeight : CANDIDATES_HEIGHT
    const canditatesItemH = selected ? candidatesItemHeight : CANDIDATES_ITEM_HEIGHT
    const badgeNumber = this.badgeNumber()
    return (
        <Animatable.View
            style={styles.cardWrapper}
            animation={shouldAnimate ? 'zoomIn' : null}>
            <TouchableWithoutFeedback onPress={this.toggleVacancyDetails}>
                <Animated.View style={[styles.mainContent, { height: vacancyCardHeight }]}>
                    <View style={styles.leftContent}>
                        <View style={styles.content}>
                            <Image style={styles.vacancyPhoto} source={imageSrc} />
                            <View style={{ flex: 1 }}>
                            <Text style={styles.vacancyName} numberOfLines={1} ellipsizeMode={'tail'}>{name}</Text>
                            <View style={styles.vacancyRow}>
                                <SealIcon name='location' style={[styles.vacancyRowIcon, { marginRight: 8 }]} size={11} />
                                <Text style={styles.vacancyAddress} numberOfLines={1} ellipsizeMode={'tail'}>{address}</Text>
                            </View>
                            <View style={styles.vacancyRow}>
                                <VacancyDate schedules={schedules} />
                            </View>
                            </View>
                        </View>
                        {
                            !selected &&
                            <Animated.View style={{height: canditatesH}}>
                                <Candidates
                                candidatesItemHeight={canditatesItemH}
                                candidates={[...acceptedMatchings, ...sealedMatchings]}
                                />
                            </Animated.View>
                        }
                    </View>
                    {
                        !selected &&
                        <View style={styles.rightContent}>
                            {
                            !!badgeNumber &&
                            <View style={styles.notificationCircle}>
                                <Text style={styles.notificationText}>{badgeNumber}</Text>
                            </View>
                            }
                            <View style={styles.state}>
                            <Text style={[styles.stateText, styles[`${state}Text`]]}>{T(`${state}Status`)}</Text>
                            </View>
                        </View>
                    }
                </Animated.View>
            </TouchableWithoutFeedback>
            {
                selected && (
                    <Animated.View style={{ height: expandedMenuHeight }}>
                    <VacancyMenu
                        goTo={goTo}
                        goToCandidates={this.goToCandidates(vacancyId)}
                        vacancyStatus={state}
                        pending={pendingMatchings.length}
                        bubbled={bubbledMatchings.length}
                        menuItemHeight={menuItemHeight}
                        onEditVacancy={this.onEditPress}
                        onPauseVacancy={this.onPausePress}
                        onReuseVacancy={this.onReusePress}
                        onResumeVacancy={this.onResumePress}
                    />
                    </Animated.View>
                )
            }
        </Animatable.View>
    )
  }
}

VacancyCard.propTypes = {
  vacancy: PropTypes.any,
  onAnimationEnd: PropTypes.func,
  onVacancyPress: PropTypes.func,
  onEditVacancy: PropTypes.func,
  onReuseVacancy: PropTypes.func
}

const styles = StyleSheet.create({
  cardWrapper: {
    backgroundColor: colors.white,
    borderRadius: 8,
    margin: 10,
    shadowColor: 'rgba(0,0,0, 0.17)',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 5,
    shadowOpacity: 1,
    elevation: 2,
    flex: 1
  },
  content: {
    flex: 1,
    flexDirection: 'row'
  },
  vacancyPhoto: {
    borderRadius: 4,
    height: 60,
    width: 60,
    marginRight: 10
  },
  vacancyName: {
    color: colors.dark,
    fontFamily: fonts.openSansRegular,
    fontSize: 16
  },
  vacancyAddress: {
    color: colors.dark,
    fontFamily: fonts.openSansLight,
    fontSize: 12
  },
  vacancyRow: {
    flexDirection: 'row',
    marginTop: 3,
    alignItems: 'center'
  },
  vacancyRowIcon: {
    marginRight: 4,
    height: 12
  },
  leftContent: {
    flex: 0.8
  },
  rightContent: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginRight: 5
  },
  notificationCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.salmon,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5
  },
  notificationText: {
    color: colors.white,
    fontFamily: fonts.openSansLight,
    fontSize: 12,
    letterSpacing: -0.2
  },
  state: {
    position: 'absolute',
    bottom: 8,
    right: 0
  },
  stateText: {
    fontFamily: fonts.openSansLight,
    fontSize: 14,
    letterSpacing: -0.2,
    width: 80,
    textAlign: 'right'
  },
  activeText: {
    color: colors.lightBlue
  },
  pausedText: {
    color: colors.salmon
  },
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    padding: 10
  }
})

const mapStateToProps = (state, ownProps) => ({
  hasInternet: getInternetStatus(state),
  acceptedMatchings: selectors.matchings.getAcceptedMatchings(state, ownProps.vacancy.id),
  sealedMatchings: selectors.matchings.getSealedMatchings(state, ownProps.vacancy.id),
  pendingMatchings: selectors.matchings.getPendingMatchings(state, ownProps.vacancy.id),
  bubbledMatchings: selectors.matchings.getMatchingsWithBubble(state, ownProps.vacancy.id)
})

const mapDispatchToProps = dispatch => bindActionCreators({
  getCandidatesRequest
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(VacancyCard)
