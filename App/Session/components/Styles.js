import { StyleSheet, Dimensions } from 'react-native'
import fonts from '../../Common/fonts'
import colors from '../../Common/colors'
const { width } = Dimensions.get('window')
export default StyleSheet.create({
  authContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  inputGroup: {
    marginTop: 20,
    height: 40,
    width: width - 23 * 2
  },
  input: {
    textAlignVertical: 'center',
    height: 40,
    borderRadius: 4,
    color: colors.dark,
    borderWidth: 1,
    borderColor: colors.authBorder,
    paddingLeft: 10,
    paddingRight: 25,
    fontFamily: fonts.openSansRegular,
    fontSize: 16
  },
  inputIcon: {
    position: 'absolute',
    top: 13,
    right: 10
  },
  button: {
    height: 42,
    marginTop: 15,
    width: width - 23 * 2
  },
  buttonLabel: {
    fontFamily: fonts.openSansLight,
    fontSize: 16,
    textAlign: 'center',
    letterSpacing: -0.3
  },
  loader: {
    marginTop: 15,
    height: 42
  },
  termsContainer: {
    width: width - 60 * 2,
    marginTop: 5,
    alignItems: 'center'
  },
  terms: {
    textAlign: 'center',
    fontFamily: fonts.openSansSemibold,
    fontSize: 12,
    color: 'rgb(178,178,178)'
  },
  forgotButton: {
    marginTop: 15,
    alignItems: 'center',
    height: 20,
    justifyContent: 'center',
    width
  },
  forgotText: {
    color: colors.lightBlue,
    fontFamily: fonts.openSansLight,
    fontSize: 14,
    letterSpacing: -0.2
  },
  passwordHintContainer: {
    marginVertical: 2,
    alignSelf: 'flex-start',
    marginLeft: 23
  },
  passwordHintText: {
    color: '#9C9C9C',
    fontFamily: fonts.openSansLight,
    fontSize: 12,
    letterSpacing: -0.2
  },
  errorContainer: {
    marginTop: 5
  },
  errorText: {
    fontSize: 14,
    fontFamily: fonts.openSansSemibold,
    color: colors.salmon
  },
  inputErrorText: {
    marginTop: 2,
    marginLeft: 2,
    height: 24,
    color: colors.salmon,
    fontSize: 12,
    fontFamily: fonts.openSansSemibold
  },
  inputErrorBorder: {
    color: colors.salmon,
    borderColor: colors.salmon
  }
})
