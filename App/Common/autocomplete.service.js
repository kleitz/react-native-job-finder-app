import Config from 'react-native-config'
const googleURL = `https://maps.googleapis.com/maps/api/place/autocomplete/json?`

class Autocomplete {
  getSuggestions (value, lg) {
    const url = `${googleURL}input=${encodeURIComponent(value)}&language=${lg}&key=${Config.GOOGLE_API_BROWSER_KEY}`
    return fetch(url)
  }
}

export default new Autocomplete()
