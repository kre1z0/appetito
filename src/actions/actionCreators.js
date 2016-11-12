import * as actionTypes from '../actions/actionTypes'

let recipes = [
  {
    name: 'Omelette',
    ingredients: [
      '3 Eggs', '1/3 cup Grated chedder cheese', 'half cup of spinach', '1/4 cup of diced onions'
    ],
    directions: 'Pay someone else to make your Omelette!'
  },
  {
    name: 'Chicken Quesadilla',
    ingredients: [
      '2 tortillas',
      '1/4c chedderjack cheese',
      '1/4c diced tomatoes',
      '1/4c diced chicken breast (cooked)',
      '1tbsp butter'
    ],
    directions: 'Pay someone else to make your quesadilla!'
  }
]

const actions = {
  getAllRecipes: () => {
    return (dispatch) => {
      dispatch(
        {
          type: actionTypes.GET_ALL_RECIPES,
          payload: recipes
        }
      )
    }
  },

  setCurrentRecipe: (recipe) => {
    return {
      type: actionTypes.SET_CURRENT_RECIPE,
      payload: recipe
    }
  },
  editRecipe: () => {
    return {
      type: actionTypes.EDIT_RECIPE
    }
  },

  updateRecipe: (recipe) => {
    return {
      type: actionTypes.UPDATE_RECIPE,
      payload: recipe
    }
  },

  createRecipe: () => {
    return {
      type: actionTypes.CREATE_RECIPE
    }
  },

  saveNewRecipe: (recipe) => {
    return {
      type: actionTypes.SAVE_NEW_RECIPE,
      payload: recipe
    }
  },

  deleteRecipe: (recipeId) => {
    return {
      type: actionTypes.DELETE_RECIPE,
      payload: recipeId
    }
  },

  toggleModal: () => {
    return {
      type: actionTypes.TOGGLE_MODAL
    }
  }
}

export default actions
