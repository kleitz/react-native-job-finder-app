import React, { Component } from 'react'
import I18n from 'react-native-i18n'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Actions } from 'react-native-router-flux'
import { View, Text, StyleSheet, ScrollView, TouchableWithoutFeedback } from 'react-native'

import fonts from '../../Common/fonts'
import colors from '../../Common/colors'
import Button from '../../Common/Button'
import Checkbox from '../../Common/Checkbox'
import SealHeader from '../../Common/SealHeader'

import selectors from '../createVacancy.selectors'
import { getVacancyLoader } from '../../Utility/loaders/loaders.selectors'
import { getInternetStatus } from '../../Utility/netInfo/netInfo.selectors'
import { publishVacancy, submitEdit, submitReuse, clearVacancy, markJobCategoryAsSelected, accessedScreen } from '../createVacancy.actions'

class CreateVacancy extends Component {
  componentDidMount () {
    const { isEditing, isReusing, markJobCategoryAsSelected, accessedScreen } = this.props

    if (isEditing || isReusing) {
      markJobCategoryAsSelected()
      accessedScreen({propToUpdate: 'accessedWage'})
      accessedScreen({propToUpdate: 'accessedCapacities'})
    }
  }

  componentWillUnmount () {
    const { isEditing, isReusing, clearVacancy } = this.props

    if (isEditing || isReusing) {
      clearVacancy()
    }
  }

  submitButtonFn = () => {
    const { publishVacancy, submitEdit, submitReuse, isEditing, isReusing, hasInternet } = this.props

    if (isEditing) {
      return () => {
        if (!hasInternet) {
          alert(I18n.t(`noInternetConnection`))
          return
        } else {
          submitEdit()
        }
      }
    }

    if (isReusing) {
      return () => {
        if (!hasInternet) {
          alert(I18n.t(`noInternetConnection`))
          return
        } else {
          submitReuse()
        }
      }
    }

    return () => {
      if (!hasInternet) {
        alert(I18n.t(`noInternetConnection`))
        return
      } else {
        publishVacancy()
      }
    }
  }

  backFn = () => {
    const { isEditing, isReusing, clearVacancy } = this.props

    if (isEditing || isReusing) {
      clearVacancy()
    }

    Actions.pop()
    setTimeout(() => {
      Actions.vacanciesTab()
    })
  }

  goToStep = (step) => () => {
    const { hasInternet } = this.props
    if (!hasInternet) {
      alert(I18n.t(`noInternetConnection`))
    } else {
      Actions[step]()
    }
  }

  render () {
    const { checkboxes, canPublish, isEditing, isReusing } = this.props

    let headerTitle = I18n.t('createVacancy.title')
    if (isEditing) {
      headerTitle = I18n.t('createVacancy.editVacancy')
    }
    if (isReusing) {
      headerTitle = I18n.t('createVacancy.reuseVacancy')
    }

    return (
      <View style={styles.container}>
        <SealHeader
          leftBtnFn={this.backFn}
          leftBtnText={I18n.t('buttons.cancel')}
          title={headerTitle}
        />
        <ScrollView style={styles.scrollContainer}>
          <TouchableWithoutFeedback onPress={this.goToStep('nvJobTitle')}>
            <View style={[styles.item, styles.topBorder]}>
              <Text style={styles.itemTitle}>{I18n.t('createVacancy.jobTitle')}</Text>
              <Text style={styles.itemDescription}>{I18n.t('createVacancy.jobTitleInfo')}</Text>
              <Checkbox checked={checkboxes.hasJobTitle} checkboxStyle={styles.checkbox} />
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={this.goToStep('nvJobCategory')}>
            <View style={styles.item}>
              <Text style={styles.itemTitle}>{I18n.t('createVacancy.jobCategoriesTitle')}</Text>
              <Text style={styles.itemDescription}>{I18n.t('createVacancy.jobCategoriesInfo')}</Text>
              <Checkbox checked={checkboxes.hasJobCategory} checkboxStyle={styles.checkbox} />
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={this.goToStep('nvPersonalityTraits')}>
            <View style={styles.item}>
              <Text style={styles.itemTitle}>{I18n.t('createVacancy.personalityTraitsTitle')}</Text>
              <Text style={styles.itemDescription}>{I18n.t('createVacancy.personalityTraitsInfo')}</Text>
              <Checkbox checked={checkboxes.hasTraits} checkboxStyle={styles.checkbox} />
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={this.goToStep('nvJobLocation')}>
            <View style={styles.item}>
              <Text style={styles.itemTitle}>{I18n.t('createVacancy.jobLocation')}</Text>
              <Text style={styles.itemDescription}>{I18n.t('createVacancy.jobLocationInfo')}</Text>
              <Checkbox checked={checkboxes.hasLocation} checkboxStyle={styles.checkbox} />
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={this.goToStep('nvSchedule')}>
            <View style={styles.item}>
              <Text style={styles.itemTitle}>{I18n.t('createVacancy.schedule')}</Text>
              <Text style={styles.itemDescription}>{I18n.t('createVacancy.scheduleInfo')}</Text>
              <Checkbox checked={checkboxes.schedule} checkboxStyle={styles.checkbox} />
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={checkboxes.hasJobCategory ? this.goToStep('nvPhoto') : null}>
            <View style={[styles.item, !checkboxes.hasJobCategory && styles.disabledItem]}>
              <Text style={styles.itemTitle}>{I18n.t('createVacancy.photo')}</Text>
              <Text style={styles.itemDescription}>{I18n.t('createVacancy.photoInfo')}</Text>
              <Checkbox checked={checkboxes.photo} checkboxStyle={styles.checkbox} />
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={this.goToStep('nvOtherCapacities')}>
            <View style={styles.item}>
              <Text style={styles.itemTitle}>{I18n.t('createVacancy.otherCapacities')}</Text>
              <Text style={styles.itemDescription}>{I18n.t('createVacancy.otherCapacitiesInfo')}</Text>
              <Checkbox checked={checkboxes.hasAccessedCapacities} checkboxStyle={styles.checkbox} />
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={this.goToStep('nvDescription')}>
            <View style={styles.item}>
              <Text style={styles.itemTitle}>{I18n.t('createVacancy.description')}</Text>
              <Text style={styles.itemDescription}>{I18n.t('createVacancy.descriptionInfo')}</Text>
              <Checkbox checked={checkboxes.hasDescription} checkboxStyle={styles.checkbox} />
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={this.goToStep('nvWage')}>
            <View style={styles.item}>
              <Text style={styles.itemTitle}>{I18n.t('createVacancy.wageTitle')}</Text>
              <Text style={styles.itemDescription}>{I18n.t('createVacancy.wageInfo')}</Text>
              <Checkbox checked={checkboxes.hasAccessedWage} checkboxStyle={styles.checkbox} />
            </View>
          </TouchableWithoutFeedback>

        </ScrollView>
        <Button
          opacity={0.9}
          labelStyle={styles.publishText}
          onPress={canPublish ? this.submitButtonFn() : null}
          btnStyle={[styles.publishButton, !canPublish && styles.disabledButton]}
        >
          <Text>
            { isEditing || isReusing
                ? I18n.t('buttons.save')
                : I18n.t('createVacancy.publish')
            }
          </Text>
        </Button>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  steps: selectors.getSteps(state),
  hasInternet: getInternetStatus(state),
  vacancyLoader: getVacancyLoader(state),
  checkboxes: selectors.getCompleteStatus(state),
  canPublish: selectors.getPublishStatus(state)
})

const mapDispatchToProps = dispatch => bindActionCreators({
  publishVacancy, submitEdit, submitReuse, clearVacancy, markJobCategoryAsSelected, accessedScreen
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(CreateVacancy)

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollContainer: {
    backgroundColor: colors.background
  },
  scrollStyle: {
    flex: 1
  },
  checkbox: {
    position: 'absolute',
    top: 22,
    right: 13
  },
  topBorder: {
    borderTopColor: colors.inputBorder,
    borderTopWidth: 1
  },
  item: {
    justifyContent: 'center',
    paddingLeft: 13,
    minHeight: 64,
    backgroundColor: colors.white,
    borderBottomColor: colors.inputBorder,
    borderBottomWidth: 1,
    paddingRight: 45
  },
  disabledItem: {
    opacity: 0.3
  },
  itemTitle: {
    fontFamily: fonts.openSansRegular,
    fontSize: 16,
    color: colors.lightBlue
  },
  itemDescription: {
    fontFamily: fonts.openSansRegular,
    fontSize: 12,
    color: colors.warmGrey
  },
  publishButton: {
    backgroundColor: colors.lightBlue,
    height: 50,
    borderRadius: 0
  },
  publishText: {
    fontSize: 16,
    fontFamily: fonts.openSansRegular,
    textAlign: 'center',
    textAlignVertical: 'center',
    letterSpacing: -0.3,
    color: colors.white
  },
  disabledButton: {
    backgroundColor: colors.buttonGrey
  }
})
