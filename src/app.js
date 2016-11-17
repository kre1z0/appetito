import { Provider } from 'react-redux'
import React from 'react'
import ReactDOM from 'react-dom'
import './styles/main.scss'
import store from './store/configureStore'
import RecipeApp from './views/RecipeApp'

ReactDOM.render(
  <Provider store={store} >
    <RecipeApp />
  </Provider>,
  document.getElementById('root'))
