import { StyleSheet } from 'react-native'
import colors from '../../../Common/colors'
import fonts from '../../../Common/fonts'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  inputWrapper: {
    borderColor: colors.inputBorder,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    backgroundColor: colors.white,
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: 20
  },
  inputGroupIcon: {
    position: 'absolute',
    right: 10,
    top: 15
  },
  input: {
    height: 42,
    fontFamily: fonts.openSansRegular,
    fontSize: 16,
    color: colors.dark
  },
  rightButtonStyle: {
    backgroundColor: 'salmon',
    width: 75,
    height: 50
  }
})
