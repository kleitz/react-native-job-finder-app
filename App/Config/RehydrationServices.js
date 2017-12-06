import ReduxPersist from './ReduxPersist'
import { AsyncStorage, NetInfo } from 'react-native'
import { persistStore } from 'redux-persist-immutable'

import { appStartup } from '../Session/session.actions'

const updateReducers = store => {
  const reducerVersion = ReduxPersist.reducerVersion
  const config = ReduxPersist.storeConfig

  const startup = () => {
    NetInfo.isConnected.fetch().then(status => store.dispatch(appStartup(status)))
  }

  // Check to ensure latest reducer version
  AsyncStorage.getItem('reducerVersion')
    .then(localVersion => {
      if (localVersion !== reducerVersion) {
        console.tron.display({
          name: 'PURGE',
          value: {
            'Old Version:': localVersion,
            'New Version:': reducerVersion
          },
          preview: 'Reducer Version Change Detected',
          important: true
        })
        // Purge store
        persistStore(store, config, startup).purge()
        AsyncStorage.setItem('reducerVersion', reducerVersion)
      } else {
        persistStore(store, config, startup)
      }
    })
    .catch(() => {
      persistStore(store, config, startup)
      AsyncStorage.setItem('reducerVersion', reducerVersion)
    })
}

export default { updateReducers }
