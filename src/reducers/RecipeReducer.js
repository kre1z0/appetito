import * as actionTypes from '../actions/actionTypes'

const INITIAL_RECIPE_STATE = {
  lastId: 0,
  all: [],
  currentRecipe: { id: null }
}

// ====== Reducer Helpers =========//
function getNextId (lastId) {
  return lastId + 1
}
// ------ End Reducer Helpers -----//

function RecipeReducer (state = INITIAL_RECIPE_STATE, action) {
  switch (action.type) {
    case actionTypes.GET_ALL_RECIPES:
      let lastId = state.lastId
      let recipes = action.payload.recipes.all.map(recipe => {
        lastId = getNextId(lastId)
        recipe.id = lastId
        return recipe
      })
      return Object.assign({}, state, { lastId: lastId }, { all: recipes })
    case actionTypes.SET_CURRENT_RECIPE:
      let newCurrent = state.currentRecipe.id === action.payload.id ? INITIAL_RECIPE_STATE.currentRecipe
        : action.payload
      return Object.assign({}, state, { currentRecipe: newCurrent })
    case actionTypes.UPDATE_RECIPE:
      return Object.assign({}, state, { currentRecipe: action.payload }, {
          all: state.all.map(recipe => {
            if (recipe.id === action.payload.id) {
              return action.payload
            }
            return recipe
          })
        }
      )
    case actionTypes.SAVE_NEW_RECIPE:
      let newRecipe = action.payload
      newRecipe.id = getNextId(state.lastId)
      let allRecipes = state.all
      allRecipes.push(newRecipe)
      return Object.assign({}, state, { all: allRecipes })
    case actionTypes.DELETE_RECIPE:
      return Object.assign({}, state, {
        all: state.all.filter(recipe => {
          return recipe.id !== action.payload
        })
      })
    default:
      return state
  }
}

export default RecipeReducer
