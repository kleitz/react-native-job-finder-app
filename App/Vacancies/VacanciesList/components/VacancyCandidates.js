import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, StyleSheet, Image, Animated, Platform } from 'react-native'
// import CacheableImage from 'react-native-cacheable-image'

import fonts from 'common/fonts'
import colors from 'common/colors'
import utils from 'utils/utils'

const T = utils.translateHelper('vacancy')
const VacancyCandidates = ({ candidates, candidatesItemHeight }) => (
  <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginBottom: 5 }}>
    {
      (candidates && candidates.length > 0)
        ? candidates.slice(0, 10).map((c, i) =>
          Platform.OS === 'ios'
          ? <Image
            key={i}
            source={{ uri: c.employeeProfilePicture || `https://dummyimage.com/600x400/000/ff00d5` }}
            style={[styles.candidatePhoto,
            { top: 2, left: 26 * i - 8 * i, zIndex: candidates.length - i }
            ]}
          />
          : <Image
            key={i}
            source={{ uri: c.employeeProfilePicture || `https://dummyimage.com/600x400/000/ff00d5` }}
            style={[styles.candidatePhoto,
            { top: 2, left: 26 * i - 8 * i, zIndex: candidates.length - i }
            ]}
          />
        )

        : <Text style={styles.noCandidatesText}>{T('noCandidates')}...</Text>
    }
  </View>
)

VacancyCandidates.propTypes = {
  candidates: PropTypes.array,
  candidatesItemHeight: PropTypes.any
}

const styles = StyleSheet.create({
  candidatePhoto: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderColor: colors.fadedGray,
    borderWidth: 1,
    position: 'absolute'
  },
  noCandidatesText: {
    fontSize: 14,
    fontFamily: fonts.openSansRegular,
    color: colors.greyish,
    letterSpacing: -0.2,
    marginBottom: 2
  }
})

export default VacancyCandidates
