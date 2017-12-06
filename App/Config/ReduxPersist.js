import { AsyncStorage } from 'react-native'

const REDUX_PERSIST = {
  active: true,
  reducerVersion: '2',
  storeConfig: {
    storage: AsyncStorage
  }
}

export default REDUX_PERSIST
