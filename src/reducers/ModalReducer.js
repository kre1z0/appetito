import * as actionTypes from '../actions/actionTypes'

const INITIAL_MODAL_STATE = {
  isOpen: false,
  newEntry: false
}

function ModalReducer (state = INITIAL_MODAL_STATE, action) {
  switch (action.type) {
    case actionTypes.TOGGLE_MODAL:
      return Object.assign({}, state, { isOpen: !state.isOpen })
    case actionTypes.EDIT_RECIPE:
      return Object.assign({}, state, { newEntry: false })
    case actionTypes.CREATE_RECIPE:
      return Object.assign({}, state, { newEntry: true })
    default:
      return state
  }
}

export default ModalReducer
