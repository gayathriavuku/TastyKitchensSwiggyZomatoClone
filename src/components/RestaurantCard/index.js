import {Link} from 'react-router-dom'

import './index.css'

const RestaurantCard = props => {
  const {restaurentData} = props
  const {cuisine, imageUrl, rating, name, id, userRating} = restaurentData

  return (
    <Link
      to={`/restaurant/${id}`}
      className="link-item"
      testid="restaurant-item"
    >
      <li className="restaurent-item" testid="restaurant-item">
        <div className="restaurent-image-container">
          <img src={imageUrl} alt="restaurent" className="thumbnail" />
        </div>
        <div className="restaurent-details-container">
          <h1 className="title">{name}</h1>
          <p className="brand">by {cuisine}</p>
          <div className="rating-container">
            <img
              src="https://res.cloudinary.com/dh4d9iuty/image/upload/v1633148899/star_image_ynmj3g.png"
              alt="star"
              className="star"
            />
            <p className="rating">{userRating.rating}</p>
            <p>{`(${userRating.totalReviews})`}</p>
          </div>
        </div>
      </li>
    </Link>
  )
}
export default RestaurantCard
