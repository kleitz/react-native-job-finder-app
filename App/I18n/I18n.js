import I18n from 'react-native-i18n'
import DeviceInfo from 'react-native-device-info'
import 'moment/min/locales'

// Enable fallbacks if you want `en-US` and `en-GB` to fallback to `en`
I18n.fallbacks = true

// English language is the main language for fall back:
I18n.translations = {
  en: require('./english.json')
}

let languageCode = DeviceInfo.getDeviceLocale().substr(0, 2)

// All other translations for the app goes to the respective language file:
switch (languageCode) {
  case 'nl':
  case 'nl-BE':
    I18n.translations.nl = require('./nl.json')
    break
}
