import { combineReducers } from 'redux'
import RecipeReducer from './RecipeReducer'
import ModalReducer from './ModalReducer'

const rootReducer = combineReducers({
  recipes: RecipeReducer,
  modal: ModalReducer
})

export default rootReducer
