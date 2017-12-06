import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Actions } from 'react-native-router-flux'
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native'

import fonts from '../../../Common/fonts'
import ImageManager from '../../../Images'
import utils from '../../../Utility/utils'
import colors from '../../../Common/colors'
import SealHeader from '../../../Common/SealHeader'

import VacancyCard from './VacancyCard'
import { getVacancyLoader } from '../../../Utility/loaders/loaders.selectors'

import selectors from '../../vacancies.selectors'

import {
  setSelectedVacancy, editVacancyRequest, pauseVacancyRequest, resumeVacancyRequest, reuseVacancyRequest
} from '../list.actions'

const T = utils.translateHelper('vacancy')

class Vacancies extends Component {
  editVacancy = (vacancy) => () => {
    this.props.editVacancyRequest(vacancy)
  }

  pauseVacancy = (vacancy) => () => {
    this.props.pauseVacancyRequest(vacancy)
  }

  resumeVacancy = (vacancy) => () => {
    this.props.resumeVacancyRequest(vacancy)
  }

  reuseVacancy = (vacancy) => () => {
    this.props.reuseVacancyRequest(vacancy)
  }

  goTo = (params) => (where, type) => () => {
    Actions[where]({...params})
  }

  render () {
    const {
      vacancies, setAnimatableOff,
      selectedVacancy, setSelectedVacancy
    } = this.props
    return (
      <View style={styles.container}>
        <SealHeader
          title={T('title')}
        />
        {
          vacancies.length > 0
            ? <ScrollView>
              {
                vacancies.map((vacancy, key) =>
                  <VacancyCard
                    key={key}
                    cardIndex={key}
                    vacancy={vacancy}
                    onAnimationEnd={setAnimatableOff}
                    selectedVacancy={selectedVacancy}
                    onVacancyPress={setSelectedVacancy}
                    onEditVacancy={this.editVacancy(vacancy)}
                    goTo={this.goTo({ vacancyId: vacancy.id })}
                    onPauseVacancy={this.pauseVacancy(vacancy)}
                    onReuseVacancy={this.reuseVacancy(vacancy)}
                    onResumeVacancy={this.resumeVacancy(vacancy)}
                  />
                )
              }
            </ScrollView>
            : 
            <View style={styles.noVacancies}>
              <Image style={styles.noVacancyPlaceholder} source={ImageManager.common.vacanciesPlaceholder} />
              <Text style={styles.noVacancyInfo} numberOfLines={2}>{T('noVacancyInfo')}</Text>
              <Image style={styles.noVacancyPlaceholderHint} resizeMode={'stretch'} source={ImageManager.common.vacanciesPlaceholderHint} />
            </View>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  noVacancies: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 45,
    marginRight: 31,
    paddingHorizontal: 25
  },
  noVacancyInfo: {
    fontSize: 16,
    fontFamily: fonts.openSansRegular,
    color: colors.warmGrey,
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  noVacancyPlaceholder: {
    width: 83,
    height: 100,
    marginTop: 56
  },
  noVacancyPlaceholderHint: {
    width: 83,
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 20,
    flex: 1
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

const mapStateToProps = (state, ownProps) => ({
  vacancyLoader: getVacancyLoader(state),
  vacancies: selectors.vacancies.getVacancies(state)
})

const mapDispatchToProps = dispatch => bindActionCreators({
  setSelectedVacancy, editVacancyRequest, pauseVacancyRequest, resumeVacancyRequest, reuseVacancyRequest
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Vacancies)
