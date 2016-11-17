import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import actions from '../actions/actionCreators'

const mapStateToModalProps = (state) => {
  return {
    id: state.recipes.currentRecipe.id,
    newEntry: state.modal.newEntry,
    name: state.recipes.currentRecipe.name,
    ingredients: state.recipes.currentRecipe.ingredients,
    directions: state.recipes.currentRecipe.directions,
    modal: state.modal
  }
}

const mapDispatchToModalProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

class Modal extends React.Component {
  constructor (props) {
    super(props)
    this.closeModal = ::this.closeModal
    this.handleDirectionsChange = ::this.handleDirectionsChange
    this.handleNameChange = ::this.handleNameChange
    this.handleIngredientsChange = ::this.handleIngredientsChange
    this.handleSave = ::this.handleSave
    this.handleDelete = ::this.handleDelete
    if (!props.modal.newEntry) {
      this.state = ({
        name: props.name,
        ingredients: props.ingredients,
        directions: props.directions,
        errors: ''
      })
    } else {
      this.state = ({
        name: '',
        ingredients: [],
        directions: '',
        errors: ''
      })
    }
  }
  static propTypes = {
    id: React.PropTypes.number,
    actions: React.PropTypes.object,
    modal: React.PropTypes.object,
    name: React.PropTypes.string,
    ingredients: React.PropTypes.array,
    directions: React.PropTypes.string
  }
  componentDidMount () {
    $('#editRecipe').modal('show')
  }
  closeModal () {
    // need to have component inside different this context
    let modalComponent = this
    const editRecipe = $('#editRecipe')
    editRecipe.modal('hide')
    // Make sure bootstrap modal close finishes before
    // changing modal isOpen to false otherwise background gets stuck
    editRecipe.on('hidden.bs.modal', () => {
      modalComponent.props.actions.toggleModal()
    })
  }

  handleDelete () {
    if (this.props.id && !this.props.modal.newEntry) {
      this.props.actions.deleteRecipe(this.props.id)
    }
    this.closeModal()
  }

  handleSave () {
    let recipe = {
      id: this.props.id,
      name: this.state.name,
      ingredients: this.state.ingredients,
      directions: this.state.directions
    }
    if (recipe.name.length < 1 || recipe.ingredients.length < 1) {
      let errors = []
      if (recipe.name.length < 1) {
        errors.push('Recipe name is required.')
      }
      if (recipe.ingredients.length < 1) {
        errors.push('You must include at least one ingredient.')
      }
      if (errors.length >= 1) {
        this.setState({
          errors: errors.join(' ')
        })
        return
      }
    }
    if (!this.props.modal.newEntry) {
      this.props.actions.updateRecipe(recipe)
    } else {
      // Save a new recipe
      this.props.actions.saveNewRecipe(recipe)
    }
    this.closeModal()
  }

  handleNameChange (e) {
    e.preventDefault()
    this.setState({
      name: e.target.value
    })
  }

  handleIngredientsChange (e) {
    e.preventDefault()
    this.setState({
      ingredients: e.target.value.split(',')
    })
  }

  handleDirectionsChange (e) {
    e.preventDefault()
    this.setState({
      directions: e.target.value
    })
  }

  render () {
    if (!this.props.modal.isOpen) {
      this.closeModal()
    }
    return <div
      id={'editRecipe'}
      className='modal fade'
      data-backdrop='static'
      tabIndex='-1'
      role='dialog'
    >
      <div className='modal-dialog' >
        <div className='modal-content' >
          <div className='modal-header' >
            <button
              onClick={this.closeModal}
              type='button' className='close'
              aria-label='Close'
            >
              <span aria-hidden='true' >×</span>
            </button>
            {
              !this.props.id ? <h4 className='modal-title' >Edit Recipe</h4>
                : <h4 className='modal-title' >Create Recipe</h4>
            }
          </div>
          <div className='modal-body' >
            <div className='input-form-group' >
              <label htmlFor='recipe-name' >Recipe Name</label>
              <input type='text'
                onChange={this.handleNameChange}
                id='recipe-name'
                className='form-control'
                value={this.state.name}
                name='recipe' />
            </div>

            <div className='input-form-group' >
              <label htmlFor='ingredients' >Ingredients (Separate by a comma)</label>
              <textarea
                onChange={this.handleIngredientsChange}
                type='text'
                id='ingredients'
                className='form-control'
                value={this.state.ingredients}
                name='ingredients' />
            </div>
            <div className='input-form-group' >
              <label htmlFor='directions' >Directions</label>
              <textarea
                onChange={this.handleDirectionsChange}
                type='text'
                id='directions'
                className='form-control'
                name='directions'
                value={this.state.directions} />
            </div>
            <p className='text-danger' >
              {this.state.errors}
            </p>
          </div>
          <div className='modal-footer' >
            <button
              type='button'
              className='btn btn-default'
              onClick={this.closeModal} >
              Cancel
            </button>
            <button
              onClick={this.handleSave}
              type='button'
              className='btn btn-primary' >
              Save changes
            </button>
            <button
              onClick={this.handleDelete}
              type='button'
              className='btn btn-danger bottom-left' >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  }
}

Modal = connect(mapStateToModalProps, mapDispatchToModalProps)(Modal)

export default Modal
