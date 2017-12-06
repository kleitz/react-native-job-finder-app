import R from 'ramda'
import { createLogger } from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import { autoRehydrate } from 'redux-persist-immutable'
import { createStore, applyMiddleware, compose } from 'redux'

import Config from './DebugSettings'
import ReduxPersist from './ReduxPersist'
import RehydrationServices from './RehydrationServices'

// creates the store
export default (rootReducer, rootSaga) => {
  /* ------------- Redux Configuration ------------- */
  const middleware = []
  const enhancers = []

  /* ------------- Saga Middleware ------------- */
  const sagaMonitor = __DEV__ ? console.tron.createSagaMonitor() : null
  const sagaMiddleware = createSagaMiddleware({ sagaMonitor })
  middleware.push(sagaMiddleware)

  /* ------------- Logger Middleware ------------- */
  const SAGA_LOGGING_BLACKLIST = ['EFFECT_TRIGGERED', 'EFFECT_RESOLVED', 'EFFECT_REJECTED', 'persist/REHYDRATE']
  if (__DEV__) {
    // the logger master switch
    const USE_LOGGING = Config.reduxLogging
    // silence these saga-based messages
    // create the logger
    const logger = createLogger({
      predicate: (getState, { type }) => USE_LOGGING && R.not(R.contains(type, SAGA_LOGGING_BLACKLIST)),
      stateTransformer: state => state.toJS()
    })
    middleware.push(logger)
  }

  /* ------------- Assemble Middleware ------------- */
  enhancers.push(applyMiddleware(...middleware))

  /* ------------- AutoRehydrate Enhancer ------------- */
  if (ReduxPersist.active) {
    enhancers.push(autoRehydrate())
  }

  // if Reactotron is enabled (default for __DEV__), we'll create the store through Reactotron
  // const createAppropriateStore = Config.useReactotron ? console.tron.createStore : createStore
  const store = createStore(rootReducer, compose(...enhancers))

  // configure persistStore and check reducer version number
  if (ReduxPersist.active) {
    RehydrationServices.updateReducers(store)
  }

  // kick off root saga
  sagaMiddleware.run(rootSaga)

  return store
}
