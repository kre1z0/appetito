import { createStore, applyMiddleware } from 'redux'
import rootReducer from '../reducers/index'
import persistData from '../actions/persistData'

// ====== Redux Middleware ======//

function thunkMiddleware ({ dispatch, getState }) {
  return next => action =>
    typeof action === 'function' ? action(dispatch, getState) : next(action)
}

const logger = store => next => action => {
  console.group(action.type)
  console.log('previous state', store.getState())
  console.info('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  console.groupEnd(action.type)
  return result
}

const store = createStore(rootReducer,
  applyMiddleware(thunkMiddleware, persistData, logger))

export default store
