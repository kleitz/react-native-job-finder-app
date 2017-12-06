import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, StyleSheet, Animated, TouchableWithoutFeedback
} from 'react-native'

import utils from 'utils/utils'
import fonts from 'common/fonts'
import colors from 'common/colors'
import SealIcon from 'common/SealIcon'

let T = utils.translateHelper('vacancy')

const MENU_ITEM_HEIGHT = 65
const VacancyMenu = ({
  menuItemHeight, vacancyStatus, onEditVacancy, goTo, onPauseVacancy,
  onResumeVacancy, onReuseVacancy, pending, bubbled, goToCandidates
}) => {
  const opacity = menuItemHeight.interpolate({
    inputRange: [0, MENU_ITEM_HEIGHT - 10, MENU_ITEM_HEIGHT],
    outputRange: [0, 0.2, 1]
  })
  return (
    <View style={styles.extendableContent}>
      {vacancyStatus === 'active' && (
        <TouchableWithoutFeedback onPress={goToCandidates}>
          <Animated.View style={[styles.extendableItem, { height: menuItemHeight, opacity }]}>
            <SealIcon style={styles.menuItemPhoto} size={18} name={'candidates'} />
            <View style={styles.menuItemDetails}>
              <View style={styles.menuItem}>
                <Text style={styles.menuItemText}>{T('screenCandidates')}</Text>
              </View>
              <View style={[styles.rowBadge]}>
                {
                  !!pending &&
                  <View style={[styles.notificationCircle, { marginRight: 8 }]}>
                    <Text style={styles.notificationText}>
                      {pending}
                    </Text>
                  </View>
                }
                <SealIcon name={'forward'} size={13} style={{ color: colors.lightBlue, marginRight: 10, alignSelf: 'center' }} />
              </View>
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      )}
      {(vacancyStatus === 'active' || vacancyStatus === 'paused') && (
        <TouchableWithoutFeedback onPress={goTo('manageApplicants')}>
          <Animated.View style={[styles.extendableItem, { height: menuItemHeight, opacity }]}>
            <SealIcon style={[styles.menuItemPhoto, { paddingLeft: 3 }]} size={18} name={'work'} />
            <View style={styles.menuItemDetails}>
              <View style={styles.menuItem}>
                <Text style={styles.menuItemText}>{T('manageApplicants')}</Text>
              </View>
              <View style={[styles.rowBadge]}>
                {
                  !!bubbled &&
                  <View style={[styles.notificationCircle, { marginRight: 8 }]}>
                    <Text style={styles.notificationText}>
                      {bubbled}
                    </Text>
                  </View>
                }
                <SealIcon name={'forward'} size={13}
                  style={{ color: colors.lightBlue, marginRight: 10, alignSelf: 'center' }} />
              </View>
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      )}
      {(vacancyStatus === 'active' || vacancyStatus === 'paused') && (
        <TouchableWithoutFeedback onPress={onEditVacancy}>
          <Animated.View style={[styles.extendableItem, { height: menuItemHeight, opacity }]}>
            <SealIcon style={[styles.menuItemPhoto, { paddingLeft: 3 }]} size={20} name={'pencil'} />
            <View style={styles.menuItemDetails}>
              <View style={styles.menuItem}>
                <Text style={styles.menuItemText}>{T('editVacancy')}</Text>
              </View>
              <View style={[styles.rowBadge]}>
                <SealIcon name={'forward'} size={13}
                  style={{ color: colors.lightBlue, marginRight: 10, alignSelf: 'center' }} />
              </View>
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      )}
      {vacancyStatus === 'active' && (
        <TouchableWithoutFeedback onPress={onPauseVacancy}>
          <Animated.View style={[styles.extendableItem, { height: menuItemHeight, opacity }]}>
            <SealIcon style={[styles.menuItemPhoto, { paddingLeft: 3 }]} size={18} name={'pause'} />
            <View style={styles.menuItemDetails}>
              <View style={styles.menuItem}>
                <Text style={styles.menuItemText}>{T('pauseVacancy')}</Text>
              </View>
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      )}
      {vacancyStatus === 'paused' && (
        <TouchableWithoutFeedback onPress={onResumeVacancy}>
          <Animated.View style={[styles.extendableItem, { height: menuItemHeight, opacity }]}>
            <SealIcon style={[styles.menuItemPhoto, { paddingLeft: 3 }]} size={16} name={'play'} />
            <View style={styles.menuItemDetails}>
              <View style={styles.menuItem}>
                <Text style={styles.menuItemText}>{T('resumeVacancy')}</Text>
              </View>
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      )}
      {vacancyStatus === 'closed' && (
        <TouchableWithoutFeedback onPress={onReuseVacancy}>
          <Animated.View style={[styles.extendableItem, { height: menuItemHeight, opacity }]}>
            <SealIcon style={[styles.menuItemPhoto, { paddingLeft: 3 }]} size={20} name={'update-photo'} />
            <View style={styles.menuItemDetails}>
              <View style={styles.menuItem}>
                <Text style={styles.menuItemText}>{T('reuseVacancy')}</Text>
              </View>
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      )}
    </View>
  )
}

VacancyMenu.propTypes = {
  onEditVacancy: PropTypes.func,
  onReuseVacancy: PropTypes.func,
  menuItemHeight: PropTypes.object,
  vacancyStatus: PropTypes.string,
  goTo: PropTypes.func
}

const styles = StyleSheet.create({
  extendableContent: {
    flex: 1,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderBottomWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: colors.white,
    overflow: 'hidden'
  },
  extendableItem: {
    flex: 1,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: colors.inputBorder
  },
  menuItem: {
    flex: 0.8,
    justifyContent: 'center',
    paddingLeft: 10
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: fonts.openSansRegular,
    color: colors.lightBlue,
    backgroundColor: 'transparent'
  },
  menuItemPhoto: {
    width: 32,
    marginRight: 10,
    marginLeft: 15,
    color: colors.lightBlue,
    alignSelf: 'center',
    height: 21
  },
  menuItemDetails: {
    flex: 1,
    flexDirection: 'row'
  },
  notificationCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.salmon,
    alignItems: 'center',
    justifyContent: 'center'
  },
  notificationText: {
    color: colors.white,
    fontFamily: fonts.openSansLight,
    fontSize: 12,
    letterSpacing: -0.2
  },

  rowBadge: {
    flex: 0.2,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignSelf: 'center',
    marginRight: 3
  }
})
export default VacancyMenu
