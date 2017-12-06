import Config from '../Config/DebugSettings'
const Reactotron = require('reactotron-react-native').default
const errorPlugin = require('reactotron-react-native').trackGlobalErrors
const apisaucePlugin = require('reactotron-apisauce')
const { reactotronRedux } = require('reactotron-redux')
const sagaPlugin = require('reactotron-redux-saga')

if (Config.useReactotron) {
  Reactotron
    .configure({
      // host: '192.168.1.2',
      // host: '192.168.1.144', // Alex' ip - do not delete it! : - )
      host: '192.168.1.91', // Razvan's ip - do not delete it :)
      // host: '192.168.1.3',
      // host: '192.168.1.204',
      name: 'Seal Jobs Recruiter' // would you like to see your app's name?
    })

    // forward all errors to Reactotron
    .use(errorPlugin({
      // ignore all error frames from react-native (for example)
      veto: (frame) =>
        frame.fileName.indexOf('/node_modules/react-native/') >= 0
    }))

    // register apisauce so we can install a monitor later
    .use(apisaucePlugin())

    // register the redux-saga plugin so we can use the monitor in CreateStore.js
    .use(sagaPlugin())

    // let's connect!
    .connect()

  // Let's clear Reactotron on every time we load the app
  Reactotron.clear()

  // Totally hacky, but this allows you to not both importing reactotron-react-native
  // on every file.  This is just DEV mode, so no big deal.
  console.tron = Reactotron
} else {
  // a mock version should you decide to leave console.tron in your codebase
  console.tron = {
    log: () => false,
    warn: () => false,
    error: () => false,
    display: () => false,
    image: () => false
  }
}
