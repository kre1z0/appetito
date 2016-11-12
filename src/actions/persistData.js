import * as actionTypes from '../actions/actionTypes'

const persistData = store => next => action => {

  let localState = localStorage.getItem('recipe-collection')

  if (localState && typeof JSON.parse(localState) === 'object') {
    localState = JSON.parse(localState)
  }
  else {
    let all = action.payload
    let recipeState = { all: all }
    localState = Object.assign({}, { recipes: recipeState })
  }

  let result
  let newAction

  switch (action.type) {
    case actionTypes.GET_ALL_RECIPES:
      newAction = { type: action.type }
      newAction.payload = localState
      localStorage.setItem('recipe-collection', JSON.stringify(localState))
      result = next(newAction)
      return result
    case actionTypes.SAVE_NEW_RECIPE:
      localState.recipes.all.push(action.payload)
      localStorage.setItem('recipe-collection', JSON.stringify(localState))
    case actionTypes.DELETE_RECIPE:
      localState.recipes.all = localState.recipes.all.filter((recipe, index) => {
        return (index + 1) !== action.payload
      })
      localStorage.setItem('recipe-collection', JSON.stringify(localState))
    case actionTypes.UPDATE_RECIPE:
      localState.recipes.all = localState.recipes.all.map((recipe, index) => {
        if (index + 1 === action.payload.id) {
          return action.payload
        }
        return recipe
      })
      localStorage.setItem('recipe-collection', JSON.stringify(localState))
    default:
      result = next(action)
      return result
  }
}

export default persistData
