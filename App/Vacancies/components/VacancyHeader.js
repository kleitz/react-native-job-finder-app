import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Text, StyleSheet, Image, Platform, ActivityIndicator } from 'react-native'

import utils from 'utils/utils'
import fonts from 'common/fonts'
import Button from 'common/Button'
import colors from 'common/colors'
import SealIcon from 'common/SealIcon'
import ImageManager from '../../Images'
import VacancyDate from '../VacanciesList/components/VacancyDate'

const VacancyHeader = ({ backBtnFn, details, isUpdating }) => {
  if (!details) return (<View />) // something goes wrong on the logout flow, this is why we need this weird line of code

  const { headerImageUrl, name, schedules } = details
  const imageSrc = headerImageUrl ? { uri: headerImageUrl } : ImageManager.common.companyAvatarPlaceholder
  return (
    <View style={styles.header}>
      <Button onPress={backBtnFn} btnStyle={styles.backBtn}>
        <SealIcon name={'back'} size={14} color={colors.white} />
      </Button>
      <Image source={imageSrc} style={styles.vacancyPhoto} />
      <View style={styles.headerDetails}>
        <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode={'tail'}>{name}</Text>
        <VacancyDate
          schedules={schedules}
          textStyle={styles.datesText}
          componentStyle={styles.headerDates}
          iconStyle={{ color: colors.white }} />
      </View>
      {
        isUpdating &&
        <View style={styles.updatingContainer}>
          <ActivityIndicator color={colors.white} size={'small'} />
        </View>
      }
    </View>
  )
}

VacancyHeader.propTypes = {
  backBtnFn: PropTypes.func,
  details: PropTypes.object
}

const styles = StyleSheet.create({
  updatingContainer: {
    flexDirection: 'row'
  },
  updatingText: {
    paddingHorizontal: 10,
    fontSize: 14,
    color: colors.white
  },
  header: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark,
    overflow: 'hidden',
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        paddingTop: 20,
        height: 82
      },
      android: {
        paddingTop: 15,
        elevation: 1
      }
    })
  },
  headerDetails: {
    flex: 1,
    flexDirection: 'column'
  },
  headerTitle: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    paddingHorizontal: 8,
    paddingTop: 10,
    fontFamily: fonts.openSansRegular
  },
  headerDates: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
    paddingBottom: 10
  },
  datesIcon: {
    color: colors.white,
    marginRight: 8
  },
  datesText: {
    color: 'white',
    fontSize: 12,
    fontFamily: fonts.openSansRegular
  },
  backBtn: {
    backgroundColor: 'transparent',
    width: 30
  },
  vacancyPhoto: {
    borderRadius: 4,
    height: 35,
    width: 35,
    marginRight: 4
  }
})

export default VacancyHeader
