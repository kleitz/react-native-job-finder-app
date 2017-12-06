import React, { Component } from 'react'
import I18n from 'react-native-i18n'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Actions } from 'react-native-router-flux'
import {
  View, ScrollView, Text, StyleSheet, Dimensions
} from 'react-native'

import fonts from '../../../Common/fonts'
import colors from '../../../Common/colors'
import SealHeader from '../../../Common/SealHeader'
import Button from '../../../Common/Button'
import ProgressBar from '../widgets/ProgressBar'

import selectors from '../../createVacancy.selectors'
import { getInternetStatus } from '../../../Utility/netInfo/netInfo.selectors'
import { toggleTraits } from '../../createVacancy.actions'

const root = what => `createVacancy.personalityTraitsScreen.${what}`
const { width } = Dimensions.get('window')

import Tag from '../widgets/Tag'

const MAX_SELECTION = 3

class PersonalityTraits extends Component {
  nextStep = () => {
    Actions.pop()
    setTimeout(() => {
      Actions.nvJobLocation()
    })
  }

  goToMain = () => {
    Actions.pop()
    setTimeout(() => {
      Actions.createVacancy()
    })
  }

  onPress = (id, selected) => () => {
    const { toggleTraits, numberOfTraits: n } = this.props
    if (n === 0) {
      toggleTraits(id)
    } else {
      if (n === 1 && !selected) {
        toggleTraits(id)
      }
      if (n > 1 && (n < MAX_SELECTION || selected)) {
        toggleTraits(id)
      }
    }
  }

  createRows = (traits) => {
    let rows = [[]]
    let currentRow = 0

    traits.forEach(trait => {
      if (rows[currentRow].length < 2) {
        rows[currentRow].push(trait)
      } else {
        rows[++currentRow] = []
        rows[currentRow].push(trait)
      }
    })

    return rows
  }

  renderRow = (row) => (
    row.map((trait, tKey) =>
      <Tag key={tKey}
        {...trait}
        selectTag={this.onPress}
      />
    )
  )

  renderRows = (rows) => (
    rows.map((row, rKey) =>
      <View style={styles.row} key={rKey}>
        { this.renderRow(row) }
      </View>
    )
  )

  render () {
    const { traits, validation } = this.props
    let rows = this.createRows(traits)

    return (
      <View
        style={{flex: 1, backgroundColor: colors.background}}
        >
        <SealHeader
          leftIconSize={14}
          leftBtnFn={this.goToMain}
          leftBtnText={'icon-back'}
          title={I18n.t(root('title'))}
          />
        <ProgressBar step={3} totalSteps={9} />

        <ScrollView contentContainerStyle={styles.scrollWrapper}>
          <Text style={styles.hint}>{I18n.t(root('hint'))}</Text>
          <View style={styles.tagsWrapper}>
            { this.renderRows(rows) }
          </View>
        </ScrollView>

        <Button
          opacity={1}
          onPress={this.nextStep}
          btnStyle={styles.nextBtn}
          disabled={!validation.hasTraits}
        >
          {I18n.t('buttons.next').toUpperCase()}
        </Button>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  hasInternet: getInternetStatus(state),
  traits: selectors.capacities.getTraits(state),
  numberOfTraits: selectors.capacities.getNumberOfSelectedTraits(state),
  validation: selectors.getCompleteStatus(state)
})

const mapDispatchToProps = dispatch => bindActionCreators({
  toggleTraits
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PersonalityTraits)

const styles = StyleSheet.create({
  hint: {
    fontFamily: fonts.openSansLight,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 25,
    marginBottom: 15,
    marginHorizontal: 40
  },
  nextBtn: {
    borderRadius: 0,
    height: 50
  },
  btnWrapper: {
    position: 'absolute',
    bottom: 0,
    width: width
  },
  row: {
    flexDirection: 'row',
    height: 45,
    justifyContent: 'center'
  },
  tagsWrapper: {
    paddingHorizontal: 15,
    alignItems: 'center'
  }
})
