import {Link} from 'react-router-dom'
import './index.css'

const NotFound = () => (
  <div className="not-found-container">
    <img
      src="https://res.cloudinary.com/dlevaf2qr/image/upload/v1684847173/erroring_1not-found_lfpffw.png"
      alt="not found"
      className="not-found-img"
    />
    <h1 className="not-found-heading">Page Not Found</h1>
    <p className="not-found-description">
      we are sorry, the page you requested could not be found. Please go back to
      the homepage
    </p>

    <Link to="/">
      <button type="button" className="nav-to-home-btn">
        Home Page
      </button>
    </Link>
  </div>
)

export default NotFound
