import Cookies from 'js-cookie'
import {Redirect, Link} from 'react-router-dom'
import Header from '../Header'
import Footer from '../Footer'
import AllRestaurantsSection from '../AllRestaurantsSection'

import './index.css'

const Home = () => {
  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }

  return (
    <>
      <Header />

      <div className="item-sections">
        <AllRestaurantsSection />
      </div>
      <Footer />
    </>
  )
}

export default Home
