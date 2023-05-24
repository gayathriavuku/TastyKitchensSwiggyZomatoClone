import {Component} from 'react'
import {BiRupee} from 'react-icons/bi'
import {HiOutlineMinusSm} from 'react-icons/hi'
import {BsPlus} from 'react-icons/bs'

import './index.css'

class CartItem extends Component {
  increment = () => {
    const {eachCartItem, incrementQuantity} = this.props
    incrementQuantity(eachCartItem.id)
  }

  decrement = () => {
    const {eachCartItem, decrementQuantity} = this.props
    decrementQuantity(eachCartItem.id)
  }

  render() {
    const {eachCartItem} = this.props

    const price = eachCartItem.cost * eachCartItem.quantity

    return (
      <li className="cart-item" testid="cartItem">
        <div className="cart-item-image-container">
          <img
            src={eachCartItem.imageUrl}
            alt="cart-item"
            className="cart-food-image"
          />
          <h1 className="cart-item-name">{eachCartItem.name}</h1>
        </div>

        <div className="cart-item-quantity-container">
          <button type="button" onClick={this.decrement}>
            <HiOutlineMinusSm
              className="minus-icon"
              testid="decrement-quantity"
            />
          </button>
          <p>{eachCartItem.quantity}</p>
          <button type="button" onClick={this.increment}>
            <BsPlus className="plus-icon" testid="increment-quantity" />
          </button>
        </div>
        <div className="cart-item-price-container">
          <BiRupee />
          <p>{eachCartItem.cost}</p>
        </div>
      </li>
    )
  }
}

export default CartItem
