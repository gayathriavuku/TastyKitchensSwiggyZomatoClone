import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showErrorMsg: false,
    errorMsg: '',
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showErrorMsg: true, errorMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {showErrorMsg, errorMsg, username, password} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-form-container">
        <div className="login-container">
          <div className="mobile-top-container">
            <h1 className="home-heading">Home</h1>
          </div>
          <form className="form-container" onSubmit={this.onSubmitForm}>
            <div className="logo-container">
              <img
                src="https://res.cloudinary.com/dlevaf2qr/image/upload/v1684820222/Frame_274website-logo_pz3orv.png"
                className="login-website-logo-mobile-image"
                alt="website logo"
              />
              <h1 className="mobile-heading">Tasty Kitchens</h1>
            </div>
            <h1>Login</h1>
            <div className="input-container">
              <label className="input-label" htmlFor="username">
                USERNAME
              </label>
              <input
                type="text"
                id="username"
                className="username-input-field"
                value={username}
                onChange={this.onChangeUsername}
                placeholder="Username"
              />
            </div>
            <div className="input-container">
              <label className="input-label" htmlFor="password">
                PASSWORD
              </label>
              <input
                type="password"
                id="password"
                className="password-input-field"
                value={password}
                onChange={this.onChangePassword}
                placeholder="Password"
              />
            </div>
            {showErrorMsg && <p className="error-message">*{errorMsg}</p>}

            <button type="submit" className="login-button">
              Login
            </button>
          </form>
        </div>
        <div className="website-logo-container">
          <img
            src="https://res.cloudinary.com/dlevaf2qr/image/upload/v1684820487/Rectangle_1456kitchen-img_mqsu7h.png"
            className="login-image"
            alt="website login"
          />
        </div>
      </div>
    )
  }
}

export default Login
