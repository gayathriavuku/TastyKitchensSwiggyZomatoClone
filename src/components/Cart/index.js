import {Component} from 'react'
import {Link} from 'react-router-dom'
import {FaCheckCircle} from 'react-icons/fa'
import {BiRupee} from 'react-icons/bi'

import Header from '../Header'
import CartItem from '../CartItem'
import Footer from '../Footer'

import './index.css'

const cartStatusConstants = {
  initial: 'INITIAL',
  cartItemsFound: 'SUCCESS',
  noCartItems: 'FAILURE',
  paymentSuccess: 'PAYMENT',
}

class CartRoute extends Component {
  state = {cartData: [], cartStatus: cartStatusConstants.initial}

  componentDidMount() {
    window.scrollTo(0, 0)
    this.getTheCartData()
  }

  incrementCartItemQuantity = id => {
    const cartData = JSON.parse(localStorage.getItem('cartData'))
    const updatedCartData = cartData.map(eachItem => {
      if (eachItem.id === id) {
        console.log(eachItem.quantity)
        const updatedQuantity = eachItem.quantity + 1
        return {...eachItem, quantity: updatedQuantity}
      }
      return eachItem
    })
    localStorage.setItem('cartData', JSON.stringify(updatedCartData))
    this.getTheCartData()
  }

  decrementCartItemQuantity = id => {
    const cartData = JSON.parse(localStorage.getItem('cartData'))
    const updatedCartData = cartData.map(eachItem => {
      if (eachItem.id === id) {
        if (eachItem.quantity > 0) {
          console.log(eachItem.quantity)
          const updatedQuantity = eachItem.quantity - 1
          console.log('updated:>>', updatedQuantity)
          return {...eachItem, quantity: updatedQuantity}
        }
      }
      return eachItem
    })

    this.removeCartItem(updatedCartData)
  }

  removeCartItem = updatedData => {
    const updatedCartData = updatedData.filter(
      eachCartItem => eachCartItem.quantity > 0,
    )

    localStorage.setItem('cartData', JSON.stringify(updatedCartData))
    this.getTheCartData()
  }

  calculateTheTotalAmount = () => {
    const {cartData} = this.state

    const amountList = cartData.map(each => each.quantity * each.cost)

    const totalAmount = amountList.reduce((a, b) => a + b)
    return totalAmount
  }

  getTheCartData = () => {
    const cartData = JSON.parse(localStorage.getItem('cartData')) || []
    if (cartData.length === 0) {
      this.setState({
        cartStatus: cartStatusConstants.noCartItems,
      })
    } else {
      const cartItems = cartData.map(each => ({
        cost: each.cost,
        quantity: each.quantity,
        id: each.id,
        imageUrl: each.imageUrl,
        name: each.name,
      }))
      this.setState({
        cartStatus: cartStatusConstants.cartItemsFound,
        cartData: cartItems,
      })
    }
  }

  goToHomePage = () => {
    const {history} = this.props
    history.replace('/')
  }

  placeOrder = () => {
    this.setState({cartStatus: cartStatusConstants.paymentSuccess})
    localStorage.clear('cartData')
  }

  cartEmptyView = () => (
    <div className="empty-cart-container">
      <img
        src="https://res.cloudinary.com/dlevaf2qr/image/upload/v1684920714/cooking_1no-order_oismx4.png"
        alt="empty cart"
        className="empty-cart-image"
      />
      <h1 className="empty-card-head">No Order Yet!</h1>
      <p className="empty-cart-para">
        Your cart is empty. Add something from the menu.
      </p>
      <Link to="/">
        <button type="button" className="empty-cart-btn">
          {' '}
          Order Now
        </button>
      </Link>
    </div>
  )

  paymentSuccessfulView = () => (
    <div className="payment-successful-container">
      <FaCheckCircle className="payment-success-icon" />
      <h1 className="payment-successful-head">Payment Successful</h1>
      <p className="payment-successful-para">
        Thank you for ordering Your payment is successfully completed.
      </p>
      <Link to="/">
        <button type="button" className="payment-successful-btn">
          Go To Home Page
        </button>
      </Link>
    </div>
  )

  cartItemsView = () => {
    const {cartData} = this.state

    console.log(cartData)
    const totalAmount = this.calculateTheTotalAmount()
    return (
      <>
        <div>
          <div className="cart-view-container">
            <div className="cart-view">
              <div className="cart-heads">
                <h1 className="cart-nav-head">Item</h1>
                <h1 className="cart-nav-head">Quantity</h1>
                <h1 className="cart-nav-head">Price</h1>
              </div>
              <ul className="food-items-in-cart-list">
                {cartData.map(eachItem => (
                  <CartItem
                    key={eachItem.id}
                    eachCartItem={eachItem}
                    incrementQuantity={this.incrementCartItemQuantity}
                    decrementQuantity={this.decrementCartItemQuantity}
                  />
                ))}
              </ul>
              <hr />
              <div className="bill-container">
                <h1 className="order-total-head">Order Total:</h1>
                <div className="total-order-value">
                  <BiRupee />
                  <p testid="total-price">{totalAmount}.00</p>
                </div>
              </div>
              <div className="place-order-container">
                <button
                  type="button"
                  onClick={this.placeOrder}
                  className="place-order-btn"
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </>
    )
  }

  onRenderDisplayCartPage = () => {
    const {cartStatus} = this.state

    switch (cartStatus) {
      case cartStatusConstants.cartItemsFound:
        return this.cartItemsView()
      case cartStatusConstants.noCartItems:
        return this.cartEmptyView()
      case cartStatusConstants.paymentSuccess:
        return this.paymentSuccessfulView()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        <div>{this.onRenderDisplayCartPage()}</div>
      </div>
    )
  }
}

export default CartRoute
