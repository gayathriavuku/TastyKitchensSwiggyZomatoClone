import {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'

import Cookies from 'js-cookie'
import {GiHamburgerMenu} from 'react-icons/gi'
import {MdCancel} from 'react-icons/md'
import Popup from 'reactjs-popup'

import 'reactjs-popup/dist/index.css'

import CartContext from '../../context/CartContext'

import './index.css'

class Header extends Component {
  state = {isHomeActive: true, isCartActive: false}

  onClickLogout = () => {
    const {history} = this.props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  homeActive = () => {
    this.setState({isHomeActive: true, isCartActive: false})
  }

  cartActive = () => {
    this.setState({isHomeActive: false, isCartActive: true})
  }

  render() {
    const {isHomeActive, isCartActive} = this.state
    return (
      <nav className="nav-header">
        <Link to="/" className="website-logo-container">
          <img
            src="https://res.cloudinary.com/dlevaf2qr/image/upload/v1684820222/Frame_274website-logo_pz3orv.png"
            alt="website logo"
            className="website-logo"
          />
          <h1 className="website-heading">Tasty Kitchens</h1>
        </Link>
        <div className="laptop-view-nav">
          <ul>
            <Link to="/" onClick={this.homeActive}>
              {isHomeActive ? <li className="active">Home</li> : <li>Home</li>}
            </Link>
            <Link to="/cart" onClick={this.cartActive}>
              {isCartActive ? <li className="active">Cart</li> : <li>Cart</li>}
            </Link>
          </ul>
          <button
            type="button"
            className="log-out-btn"
            onClick={this.onClickLogout}
          >
            Logout
          </button>
        </div>
      </nav>
    )
  }
}

export default withRouter(Header)
