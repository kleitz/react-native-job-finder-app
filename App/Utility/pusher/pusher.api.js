import Pusher from 'pusher-js/react-native'
import Config from 'react-native-config'
import { isEmpty } from 'lodash'

const api = {
  client: {},
  channel: {}
}

const connectPusher = (recruiterId) => {
  console.log('[pusher] Init...', recruiterId)
  if (!isEmpty(api.client)) {
    return
  }
  api.client = new Pusher(Config.PUSHER_KEY, {  
    cluster: Config.PUSHER_CLUSTER
  })

  api.channel = api.client.subscribe(`mobile-recruiter-${recruiterId}`)
}

const disconnectPusher = () => {
  api.client.disconnect()
  setTimeout(() => {
    api.client = {}
    api.channel = {}
  }, 1000)
}

export {
  connectPusher,
  disconnectPusher
}

export default api
