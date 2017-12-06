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
import JobCategoryTile from '../widgets/JobCategoryTile'

import selectors from '../../createVacancy.selectors'
import { getInternetStatus } from '../../../Utility/netInfo/netInfo.selectors'
import { updateJobTypes } from '../../createVacancy.actions'

const root = what => `createVacancy.jobCategoryScreen.${what}`
const { width } = Dimensions.get('window')
const wrapperPadding = 25
const tileMargin = 15
const tileDimension = (width - wrapperPadding - tileMargin * 2 - 25) / 3

class JobCategory extends Component {
  nextStep = () => {
    Actions.pop()
    setTimeout(() => {
      Actions.nvPersonalityTraits()
    })
  }

  goToMain = () => {
    Actions.pop()
    setTimeout(() => {
      Actions.createVacancy()
    })
  }

  selectTile = (index) => {
    let updatedCategories = this.props.categories
      .map((category, crtIndex) =>
        Object.assign({}, category, { selected: crtIndex === index })
      )
    this.props.updateJobTypes(updatedCategories)
  }

  attachIconNames = (jobCategories) => {
    return jobCategories.map(category => {
      switch (category.id) {
        case 2:
          category.iconName = 'cleaning'
          return category
        case 8:
          category.iconName = 'sales'
          return category
        case 11:
          category.iconName = 'bartender'
          return category
        case 12:
          category.iconName = 'waiter'
          return category
        case 13:
          category.iconName = 'kitchen'
          return category
        case 14:
          category.iconName = 'catering'
          return category
        case 15:
          category.iconName = 'dishwash'
          return category
        case 16:
          category.iconName = 'host-hostess'
          return category
        case 17:
          category.iconName = 'event-festival'
          return category
        case 18:
          category.iconName = 'promo'
          return category
        case 19:
          category.iconName = 'shop-assistant'
          return category
        case 20:
          category.iconName = 'supermarket'
          return category
        case 21:
          category.iconName = 'retail'
          return category
        case 22:
          category.iconName = 'warehouse'
          return category
        case 23:
          category.iconName = 'delivery'
          return category
        default:
          return category
      }
    })
  }

  render () {
    let { categories, validation } = this.props

    categories = this.attachIconNames(categories)

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
        <ProgressBar step={2} totalSteps={9} />

        <ScrollView contentContainerStyle={styles.scrollWrapper}>
          <Text style={styles.hint}>{I18n.t(root('hint'))}</Text>
          <View style={styles.tilesWrapper}>
            {
              categories.map((category, index) =>
                <JobCategoryTile
                  name={category.name}
                  selected={category.selected}
                  index={index}
                  key={index}
                  iconName={category.iconName}
                  onSelect={this.selectTile}
                  tileDimension={tileDimension}
                  tileMargin={tileMargin}
                />
              )
            }
          </View>
        </ScrollView>

        <Button
          opacity={1}
          onPress={this.nextStep}
          btnStyle={styles.nextBtn}
          disabled={!validation.hasJobCategory}
          >
          {I18n.t('buttons.next').toUpperCase()}
        </Button>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  hasInternet: getInternetStatus(state),
  categories: selectors.generalInfo.getJobTypes(state),
  validation: selectors.getCompleteStatus(state)
})

const mapDispatchToProps = dispatch => bindActionCreators({
  updateJobTypes
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(JobCategory)

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
  scrollWrapper: {
    paddingHorizontal: wrapperPadding
  },
  tilesWrapper: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap'
  }
})
