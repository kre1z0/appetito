import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from '../actions/actionCreators'
import Recipe from '../components/Recipe'
import Modal from '../components/Modal'

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

class RecipeApp extends React.Component {
  constructor (props) {
    super(props)
    this.createRecipe = ::this.createRecipe
  }
  createRecipe () {
    this.props.actions.createRecipe()
    this.props.actions.toggleModal()
  }
  static propTypes = {
    currentRecipe: React.PropTypes.object,
    actions: React.PropTypes.object,
    recipes: React.PropTypes.array,
    modal: React.PropTypes.object
  }
  render () {
    return (
      <div id='main-container' >
        <h1>Bon Appétit</h1>
        <div id='container' >
          {
            this.props.modal.isOpen ? <Modal /> : null
          }
          <div className='recipe-app' >
            {this.renderRecipes()}
          </div>
          <button
            onClick={this.createRecipe}
            className='btn btn-success btn-create' >
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
          recipe.id === this.props.currentRecipe.id
        }
        {...recipe}
        actions={this.props.actions}
      />
    })
    return recipeList
  }
}

RecipeApp = connect(mapStateToRecipeAppProps, mapDispatchToRecipeAppProps)(RecipeApp)

export default RecipeApp
