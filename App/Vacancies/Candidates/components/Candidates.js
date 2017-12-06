import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Actions } from 'react-native-router-flux'
import { View, StyleSheet, Dimensions } from 'react-native'

import utils from 'utils/utils'
import fonts from 'common/fonts'
import colors from 'common/colors'
import Button from 'common/Button'
import selectors from '../../vacancies.selectors'
import { getLoadingCandidates } from 'utils/loaders/loaders.selectors'
import { acceptCandidate, denyCandidate } from '../candidates.actions'

import CandidateCard from './CandidateCard'
import SwipeCards from 'common/SwipeCards'
import VacancyHeader from '../../components/VacancyHeader'
import CandidatesPlaceholder from './CandidatesPlaceholder'

const T = utils.translateHelper('buttons')
const { height } = Dimensions.get('window')
const mainHeight = height - 72 - 70
class ScreenCandidates extends Component {
  state = {
    displayedCard: 0
  }
  handleYup = (candidate) => {
    const { vacancyId, acceptCandidate } = this.props
    acceptCandidate(vacancyId, candidate)
  }
  handleNope = (candidate) => {
    const { vacancyId, denyCandidate } = this.props
    denyCandidate(vacancyId, candidate)
  }
  onSkipPress = () => {
    const { displayedCard } = this.state
    const { candidates } = this.props
    this.handleNope(candidates[displayedCard])
  }
  onInvitePress = () => {
    const { displayedCard } = this.state
    const { candidates } = this.props
    this.handleYup(candidates[displayedCard])
  }
  onCardRemoved = (cardIndex) => {
    this.setState({ displayedCard: cardIndex })
  }
  goToCandidateProfile = (candidate) => {
    const { vacancyId } = this.props
    Actions.candidateProfile({
      vacancyId: vacancyId,
      candidateId: candidate.id
    })
  }

  render () {
    const { candidates, vacancyDetails, isLoading } = this.props
    const { displayedCard } = this.state
    const { applied } = candidates.length > 0 && candidates[displayedCard] // on top candidate
    return (
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', backgroundColor: colors.background }}>
        <VacancyHeader
          backBtnFn={Actions.pop}
          details={vacancyDetails[0]}
          />
        {
          (candidates.length > 0 && !isLoading) &&
          <View style={[styles.mainContent]}>
            <SwipeCards
              stack
              cardKey={'id'}
              showYup showNope
              stackDepth={3}
              stackOffsetX={0}
              stackOffsetY={12}
              cards={candidates}
              handleYup={this.handleYup}
              yupStyle={styles.yupStyle}
              nopeStyle={styles.nopeStyle}
              handleNope={this.handleNope}
              cardRemoved={this.onCardRemoved}
              yupTextStyle={styles.yupTextStyle}
              nopeTextStyle={styles.nopeTextStyle}
              onClickHandler={this.goToCandidateProfile}
              nopeText={applied ? T('deny') : T('skip')}
              yupText={applied ? T('accept') : T('invite')}
              renderCard={(cardData) => <CandidateCard user={cardData} />}
            />
          </View>
        }
        {
          (candidates.length > 0 && !isLoading) &&
          <View style={styles.footer}>
            <Button
              onPress={this.onSkipPress}
              btnStyle={[styles.footerBtn, styles.skipBtn]}
              labelStyle={[styles.footerBtnLabel, styles.skipBtnLabel]}
            >
              {applied ? T('deny') : T('skip')}
            </Button>
            <Button
              onPress={this.onInvitePress}
              btnStyle={styles.footerBtn}
              labelStyle={styles.footerBtnLabel}
            >
              {applied ? T('accept') : T('invite')}
            </Button>
          </View>
        }
        {
          (candidates.length === 0 || isLoading) &&
          <CandidatesPlaceholder isLoading={isLoading} />
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  mainContent: {
    height: mainHeight,
    justifyContent: 'center',
    flex: 1
  },
  footer: {
    flexDirection: 'row',
    height: 70,
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 5,
    marginBottom: 10
  },
  footerBtn: {
    flex: 1
  },
  footerBtnLabel: {
    fontSize: 18,
    fontFamily: fonts.openSans,
    letterSpacing: -0.3
  },
  skipBtn: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.inputBorder,
    marginRight: 20
  },
  skipBtnLabel: {
    color: colors.warmGrey
  },
  yupStyle: {
    position: 'absolute',
    top: 50,
    right: 40,
    height: 40,
    backgroundColor: 'transparent',
    borderColor: colors.lightBlue,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    paddingHorizontal: 20
  },
  yupTextStyle: {
    color: colors.lightBlue,
    textAlign: 'center',
    fontSize: 32
  },
  nopeStyle: {
    position: 'absolute',
    top: 50,
    left: 40,
    height: 40,
    backgroundColor: 'transparent',
    borderColor: colors.salmon,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    paddingHorizontal: 20
  },
  nopeTextStyle: {
    color: colors.salmon,
    textAlign: 'center',
    fontSize: 32
  },
  overlay: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }
})

const mapStateToProps = (state, ownProps) => {
  return {
    candidates: selectors.candidates.getCandidates(state, ownProps.vacancyId) || [],
    vacancyDetails: selectors.vacancies.getVacancyDetails(state, ownProps.vacancyId),
    isLoading: getLoadingCandidates(state)
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  acceptCandidate, denyCandidate
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ScreenCandidates)
