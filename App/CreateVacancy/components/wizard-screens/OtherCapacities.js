import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView
} from 'react-native'
import I18n from 'react-native-i18n'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Actions } from 'react-native-router-flux'

import fonts from '../../../Common/fonts'
import colors from '../../../Common/colors'
import SealHeader from '../../../Common/SealHeader'
import selectors from '../../createVacancy.selectors'
import Button from '../../../Common/Button'
import ProgressBar from '../widgets/ProgressBar'
import { toggleCarData, toggleLanguage, accessedScreen } from '../../createVacancy.actions'
import { getInternetStatus } from '../../../Utility/netInfo/netInfo.selectors'

const T = what => I18n.t(`createVacancy.otherCapacitiesScreen.${what}`)

class OtherCapacities extends Component {
  componentDidMount () {
    this.props.accessedScreen({
      propToUpdate: 'accessedCapacities'
    })
  }

  toggleCar = (type) => () => {
    const { hasInternet, toggleCarData } = this.props
    if (!hasInternet) {
      I18n.t(`noInternetConnection`)
    } else {
      toggleCarData(type)
    }
  }

  toggleLanguages = (type) => () => {
    const { hasInternet, toggleLanguage } = this.props
    if (!hasInternet) {
      I18n.t(`noInternetConnection`)
    } else {
      toggleLanguage(type)
    }
  }

  nextStep = () => {
    Actions.pop()
    setTimeout(() => {
      Actions.nvDescription()
    })
  }

  goToMain = () => {
    Actions.pop()
    setTimeout(() => {
      Actions.createVacancy()
    })
  }

  render () {
    const { hasCar, hasLicence, languages } = this.props.optionalInfo
    return (
      <View style={{flex: 1, backgroundColor: colors.background}}>
        <SealHeader
          leftIconSize={14}
          title={T('title')}
          leftBtnFn={this.goToMain}
          leftBtnText={'icon-back'}
        />
        <ProgressBar step={7} totalSteps={9} />
        <ScrollView>
          <View style={styles.section}>
            <View style={styles.item}>
              <View style={styles.itemLeftContent}>
                <Text style={styles.label}>{T('license')}</Text>
              </View>
              <View style={styles.itemRightContent}>
                <Switch
                  value={hasLicence}
                  onTintColor={colors.lightBlue}
                  onValueChange={this.toggleCar('hasLicence')}
                  />
              </View>
            </View>

            <View style={styles.item}>
              <View style={styles.itemLeftContent}>
                <Text style={styles.label}>{T('car')}</Text>
              </View>
              <View style={[styles.itemRightContent, {borderBottomWidth: 0}]}>
                <Switch
                  value={hasCar}
                  onTintColor={colors.lightBlue}
                  onValueChange={this.toggleCar('hasCar')}
                  />
              </View>
            </View>
          </View>
          <Text style={[styles.text, styles.hint]}>{T('hint1')}</Text>

          <View style={styles.section}>
            <View style={styles.item}>
              <View style={styles.itemLeftContent}>
                <Text style={styles.label}>{T('dutch')}</Text>
              </View>
              <View style={styles.itemRightContent}>
                <Switch
                  value={languages.get('dutch')}
                  onTintColor={colors.lightBlue}
                  onValueChange={this.toggleLanguages('dutch')}
                  />
              </View>
            </View>

            <View style={styles.item}>
              <View style={styles.itemLeftContent}>
                <Text style={styles.label}>{T('english')}</Text>
              </View>
              <View style={styles.itemRightContent}>
                <Switch
                  onTintColor={colors.lightBlue}
                  value={languages.get('english')}
                  onValueChange={this.toggleLanguages('english')}
                  />
              </View>
            </View>

            <View style={styles.item}>
              <View style={styles.itemLeftContent}>
                <Text style={styles.label}>{T('french')}</Text>
              </View>
              <View style={styles.itemRightContent}>
                <Switch
                  onTintColor={colors.lightBlue}
                  value={languages.get('french')}
                  onValueChange={this.toggleLanguages('french')}
                  />
              </View>
            </View>

            <View style={styles.item}>
              <View style={styles.itemLeftContent}>
                <Text style={styles.label}>{T('german')}</Text>
              </View>
              <View style={[styles.itemRightContent, {borderBottomWidth: 0}]}>
                <Switch
                  onTintColor={colors.lightBlue}
                  value={languages.get('german')}
                  onValueChange={this.toggleLanguages('german')}
                  />
              </View>
            </View>
          </View>
          <Text style={[styles.text, styles.hint]}>{T('hint2')}</Text>

        </ScrollView>
        <Button
          opacity={1}
          onPress={this.nextStep}
          btnStyle={styles.nextBtn}
        >
          {I18n.t('buttons.next').toUpperCase()}
        </Button>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  text: {
    fontFamily: fonts.openSansRegular,
    fontSize: 14
  },
  label: {
    fontFamily: fonts.openSansRegular,
    fontSize: 16
  },
  section: {
    backgroundColor: colors.white,
    borderColor: colors.inputBorder,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    marginTop: 30
  },
  item: {
    flexDirection: 'row',
    height: 42
  },
  itemLeftContent: {
    width: 110,
    paddingLeft: 15,
    alignSelf: 'center'
  },
  itemRightContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 15,
    borderColor: colors.inputBorder,
    borderBottomWidth: 1
  },
  hint: {
    marginLeft: 15,
    color: colors.warmGrey,
    marginTop: 5
  },
  nextBtn: {
    borderRadius: 0,
    height: 50
  }
})

const mapStateToProps = state => ({
  hasInternet: getInternetStatus(state),
  optionalInfo: selectors.capacities.getOptionalInfo(state)
})

const mapDispatchToProps = dispatch => bindActionCreators({
  toggleCarData, toggleLanguage, accessedScreen
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(OtherCapacities)
