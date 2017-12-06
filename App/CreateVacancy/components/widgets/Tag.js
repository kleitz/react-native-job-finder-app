import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback
} from 'react-native'

import colors from '../../../Common/colors'
import fonts from '../../../Common/fonts'

const MyComponent = ({name, selected, id, selectTag}) => (
  <TouchableWithoutFeedback onPress={selectTag(id, selected)}>
    <View style={[styles.tagWrapper, selected && styles.selected]}>
      <Text style={[styles.tagText, selected && {color: colors.white}]}>
        {name}
      </Text>
    </View>
  </TouchableWithoutFeedback>
)

const styles = StyleSheet.create({
  tagWrapper: {
    backgroundColor: colors.white,
    borderColor: colors.inputBorder,
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 10,
    marginRight: 10,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15
  },
  selected: {
    backgroundColor: colors.lightBlue,
    borderColor: colors.lightBlue
  },
  tagText: {
    color: colors.darkGrey,
    fontFamily: fonts.openSansRegular
  }
})

export default MyComponent
