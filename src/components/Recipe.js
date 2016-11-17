import React from 'react'

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

class Recipe extends React.Component {
  constructor (props) {
    super(props)
    this.setCurrentRecipe = ::this.setCurrentRecipe
    this.editRecipe = ::this.editRecipe
  }
  static propTypes = {
    id: React.PropTypes.number,
    actions: React.PropTypes.object,
    active: React.PropTypes.bool,
    name: React.PropTypes.string,
    ingredients: React.PropTypes.array,
    directions: React.PropTypes.string
  }
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
        <a onClick={this.setCurrentRecipe}
          href='#' >
          <h4 className={'recipe-header' + (this.props.active ? ' active' : '')} >
            {this.props.name}
            <i className={'glyphicon' + (this.props.active ? ' glyphicon-minus-sign' : ' glyphicon-plus-sign')} />
          </h4>
        </a>
        <div className='recipe-info' >
          <h4 className='sub-header' >Ingredients</h4>
          <IngredientList ingredients={this.props.ingredients} />
          <Directions directions={this.props.directions} />
          <button
            onClick={this.editRecipe}
            className='btn edit-btn' >
            Edit
          </button>
        </div>
      </div>
    )
  }
}

export default Recipe
