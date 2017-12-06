import { Platform } from 'react-native'

const androidFonts = {
  openSansLight: 'OpenSans-Light',
  openSansRegular: 'OpenSans-Regular',
  openSansBold: 'OpenSans-Bold',
  openSansSemibold: 'OpenSans-Semibold',
  robotoRegular: 'Roboto-Regular'
}
const iosFonts = {
  openSansLight: 'OpenSans-Light',
  openSansRegular: 'OpenSans',
  openSansBold: 'OpenSans-Bold',
  openSansSemibold: 'OpenSans-Semibold',
  robotoRegular: 'Roboto'
}

const fonts = Platform.OS === 'ios' ? iosFonts : androidFonts

export default fonts
