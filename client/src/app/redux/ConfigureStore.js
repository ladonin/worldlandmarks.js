/*
 * File src/app/redux/ConfigureStore.js
 * import ConfigureStore from 'src/app/redux/ConfigureStore';
 */

import { createStore, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import rootReducer from 'src/app/redux/reducers/Reducers'

export default function configureStore(preloadedState = {}) {
  return createStore(
    rootReducer,
    preloadedState
  )
}