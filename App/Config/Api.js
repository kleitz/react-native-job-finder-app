import apisauce from 'apisauce'
import Config from 'react-native-config'

// const devURL = `http://development-sealjobs.herokuapp.com/`
// const devURL = `http://188.2.55.148:3000/`
const stagingURL = `http://frontend-sealjobs.herokuapp.com/`

// console.log('API URL:', Config.API_URL)

const api = apisauce.create({
  baseURL: stagingURL,
  headers: {
    'Accept': `application/json`,
    'Content-Type': `application/json`
  },
  timeout: 40000
})

// api.addRequestTransform((request) => {
// request.params['APPID'] = '0e44183e8d1018fc92eb3307d885379c'
// })

/* Uncomment following code for debugging purpose */

// api.addRequestTransform(request => {
//   console.log('Request', request)
//   return request
// })
//
// api.addResponseTransform(response => {
//   console.log('Response', response)
//   return response
// })

/* END of API debugging code */

if (__DEV__ && console.tron) {
  api.addMonitor(console.tron.apisauce)
}

export default api
