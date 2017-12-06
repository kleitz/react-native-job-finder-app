import _ from 'lodash'
import Config from 'react-native-config'
import { Client } from 'bugsnag-react-native'

let BugsnagClient = {}

export const initBugsnag = () => {
  if (_.isEmpty(BugsnagClient)) {
    BugsnagClient = Object.assign(BugsnagClient, new Client(Config.BUGSNAG_KEY))
  }
}

export default BugsnagClient
