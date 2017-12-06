import React from 'react'
import I18n from 'react-native-i18n'
import { View, Text, StyleSheet } from 'react-native'

import fonts from 'common/fonts'
import colors from 'common/colors'
import SealIcon from 'common/SealIcon'

const PastItem = ({ index, icon, title, place, time, rowStyle }) => {
  const what = icon === 'work'
    ? `noExperience`
    : icon === 'languages'
      ? `noLanguages`
      : `noEducation`
  return (
    <View style={[styles.row]}>
      {
        icon &&  (
          <View style={[styles.leftContainer]}>
            <SealIcon size={17} name={icon} transclude style={{height: 18}} containerStyle={styles.iconContainer} />
          </View>
        )
      }
      <View style={[styles.rightContainer, index !== 0 && styles.borderTop]}>
        {
          !!title && <Text style={[styles.itemText, styles.title]} numberOfLines={2} ellipsizeMode={'tail'}>{title}</Text>
        }
        {
          !!title
            ? <Text style={[styles.itemText, styles.other]} numberOfLines={1} ellipsizeMode={'tail'}>{place}</Text>
            : <Text style={[styles.itemText, styles.other]}>{I18n.t(`screenCandidates.${what}`)}</Text>
        }
        {
          !!title && <Text style={[styles.itemText, styles.other]} numberOfLines={1} ellipsizeMode={'tail'}>{time}</Text>
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.openSansRegular
  },
  other: {
    fontFamily: fonts.openSansLight
  },
  itemText: {
    textAlign: 'left',
    fontSize: 16,
    letterSpacing: -0.3
  },
  rightContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  leftContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: colors.inputBorder,
    borderWidth: 1,
    backgroundColor: colors.background,
    width: 46,
    height: 46
  },
  borderTop: {
    borderTopColor: colors.inputBorder,
    borderTopWidth: 1
  },
  row: {
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})

export default PastItem
