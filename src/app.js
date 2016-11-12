import { bindActionCreators } from 'redux'
import { Provider, connect } from 'react-redux'
import React from 'react'
import ReactDOM from 'react-dom'
import './styles/main.scss'
import store from './store/configureStore'
import actions from './actions/actionCreators'

const IngredientList = (props) => {
  var count = 1
  var rows = props.ingredients.map((ingredient) => {
    return <tr key={count++} >
      <td>{ingredient}</td>
    </tr>
  })
  return (
    <table className='ingredients' >
      <tbody>
        {rows}
      </tbody>
    </table>
  )
}

const Directions = (props) => {
  return (
    <div
      className='directions'
    >
      <h4 className='sub-header' >Directions</h4>
      <p>{props.directions}</p>
    </div>
  )
}

class Modal extends React.Component {
  constructor (props) {
    super(props)

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

  componentDidMount () {
    $('#editRecipe').modal('show')
  }

  closeModal () {
    // need to have component inside different this context
    let modalComponent = this
    $('#editRecipe').modal('hide')
    // Make sure bootstrap modal close finishes before
    // changing modal isOpen to false otherwise background gets stuck
    $('#editRecipe').on('hidden.bs.modal', function () {
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
    }
    else {
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
              onClick={this.closeModal.bind(this)}
              type='button' className='close'
              aria-label='Close'
            >
              <span aria-hidden='true' >×</span>
            </button>
            {
              !this.props.id ?
                <h4 className='modal-title' >Edit Recipe</h4>
                : <h4 className='modal-title' >Create Recipe</h4>
            }
          </div>
          <div className='modal-body' >
            <div className='input-form-group' >
              <label htmlFor='recipe-name' >Recipe Name</label>
              <input type='text'
                onChange={this.handleNameChange.bind(this)}
                id='recipe-name'
                className='form-control'
                value={this.state.name}
                name='recipe' />
            </div>

            <div className='input-form-group' >
              <label htmlFor='ingredients' >Ingredients (Separate by a comma)</label>
              <textarea
                onChange={this.handleIngredientsChange.bind(this)}
                type='text'
                id='ingredients'
                className='form-control'
                value={this.state.ingredients}

                name='ingredients'
              >
                  </textarea>
            </div>
            <div className='input-form-group' >
              <label htmlFor='directions' >Directions</label>
              <textarea
                onChange={this.handleDirectionsChange.bind(this)}
                type='text'
                id='directions'
                className='form-control'
                name='directions'
                value={this.state.directions} >
                </textarea>
            </div>
            <p className='text-danger' >
              {this.state.errors}
            </p>
          </div>
          <div className='modal-footer' >
            <button
              type='button'
              className='btn btn-default'
              onClick={this.closeModal.bind(this)}
            >
              Cancel
            </button>
            <button
              onClick={this.handleSave.bind(this)}
              type='button'
              className='btn btn-primary'
            >
              Save changes
            </button>
            <button
              onClick={this.handleDelete.bind(this)}
              type='button'
              className='btn btn-danger bottom-left'
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  }
}

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

Modal = connect(mapStateToModalProps, mapDispatchToModalProps)(Modal)

class Recipe extends React.Component {

  setCurrentRecipe (e) {
    e.preventDefault()
    e.stopPropagation()

    let $currentPanel = $(e.target).closest('div').children('.recipe-info')
    let currentRecipe = {
      id: this.props.id,
      name: this.props.name,
      ingredients: this.props.ingredients,
      directions: this.props.directions
    }
    this.props.actions.setCurrentRecipe(currentRecipe)
    $('.recipe-info').not($currentPanel).slideUp(400)
    $(e.target).closest('div').children('.recipe-info').slideToggle(400)
  }

  editRecipe () {
    this.props.actions.editRecipe()
    this.props.actions.toggleModal()
  }

  render () {
    return (
      <div className='recipe' >
        <a onClick={this.setCurrentRecipe.bind(this)}
          href='#' >
          <h4 className={'recipe-header' + (this.props.active ? ' active' : '')}
          >
            {this.props.name}
            <i
              className={'glyphicon' + (this.props.active ? ' glyphicon-minus-sign' : ' glyphicon-plus-sign')} >
            </i>
          </h4>
        </a>
        <div className='recipe-info' >
          <h4 className='sub-header' >Ingredients</h4>
          <IngredientList ingredients={this.props.ingredients} />
          <Directions directions={this.props.directions} />
          <button
            onClick={this.editRecipe.bind(this)}
            className='btn edit-btn'
          >
            Edit
          </button>
        </div>
      </div>
    )
  }
}

class RecipeApp extends React.Component {
  createRecipe () {
    this.props.actions.createRecipe()
    this.props.actions.toggleModal()
  }

  render () {
    return (
      <div id='main-container' >
        <h1>Bon Appétit</h1>
        <div id='container' >
          {
            this.props.modal.isOpen ?
              <Modal />
              : null
          }
          <div className='recipe-app' >
            {this.renderRecipes()}
          </div>
          <button
            onClick={this.createRecipe.bind(this)}
            className='btn btn-success btn-create'
          >
            New Recipe
          </button>
        </div>
      </div>
    )
  }

  componentDidMount () {
    this.props.actions.getAllRecipes()
  }

  renderRecipes () {
    if (!this.props.recipes || this.props.recipes.length < 1) {
      return (
        <h4>No recipes yet. Click 'New Recipe' to get started!</h4>
      )
    }
    const recipeList = this.props.recipes.map(recipe => {
      return <Recipe
        key={recipe.id}
        active={
          recipe.id === this.props.currentRecipe.id ? true : false
        }
        {...recipe}
        actions={this.props.actions}
      />
    })
    return recipeList
  }
}

const mapStateToRecipeAppProps = (state) => {
  return {
    recipes: state.recipes.all,
    currentRecipe: state.recipes.currentRecipe,
    modal: state.modal
  }
}

const mapDispatchToRecipeAppProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

RecipeApp = connect(mapStateToRecipeAppProps, mapDispatchToRecipeAppProps)(RecipeApp)


ReactDOM.render(
  <Provider store={store} >
    <RecipeApp />
  </Provider>,
  document.getElementById('root'))
