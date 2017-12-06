// @flow
import React, { Component } from 'react'
import { Provider } from 'react-redux'
// import codePush from 'react-native-code-push'
import { Platform } from 'react-native'

import Config from 'react-native-config'

import './I18n/I18n'
import createStore from './App.reducer'
import RootContainer from './RootContainer'
import applyConfigSettings from './Config'
import { changeCodePushStatus } from './Utility/netInfo/netInfo.actions'

// Apply config overrides
applyConfigSettings()
const store = createStore()

class App extends Component {
  // componentWillMount () {
  //   // if (!__DEV__) {
  //   this.sync()
  //   // }
  // }

  // codePushStateChange = (syncStatus) => {
  //   switch (syncStatus) {
  //     case codePush.SyncStatus.SYNC_IN_PROGRESS:
  //     case codePush.SyncStatus.DOWNLOADING_PACKAGE:
  //     case codePush.SyncStatus.INSTALLING_UPDATE:
  //       store.dispatch(changeCodePushStatus(true))
  //       break
  //     case codePush.SyncStatus.UPDATE_INSTALLED:
  //     case codePush.SyncStatus.UPDATE_IGNORED:
  //     case codePush.SyncStatus.UNKNOWN_ERROR:
  //     case codePush.SyncStatus.UP_TO_DATE:
  //       store.dispatch(changeCodePushStatus(false))
  //       break
  //   }
  // }

  // sync = () => {
  //   codePush.allowRestart()
  //   codePush.sync(
  //     {
  //       checkFrequency: codePush.CheckFrequency.ON_APP_START,
  //       installMode: codePush.InstallMode.IMMEDIATE,
  //       mandatoryInstallMode: codePush.InstallMode.IMMEDIATE
  //     },
  //     this.codePushStateChange
  //   )
  // }

  render () {
    return (
      <Provider store={store}>
        <RootContainer />
      </Provider>
    )
  }
}

export { store }
// export default codePush({
//   checkFrequency: codePush.CheckFrequency.ON_APP_START,
//   installMode: codePush.InstallMode.IMMEDIATE,
//   mandatoryInstallMode: codePush.InstallMode.IMMEDIATE
// })(App)

export default App
