import {Component} from 'react'
import Cookies from 'js-cookie'
import {BiRupee} from 'react-icons/bi'
import {AiFillStar} from 'react-icons/ai'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import FoodItem from '../FoodItem/index'
import Footer from '../Footer'

import './index.css'

const restaurantsApiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class RestaurantDetails extends Component {
  state = {
    apiStatus: restaurantsApiStatusConstants.initial,
    restaurantData: [],
    loadfooter: false,
  }

  componentDidMount() {
    this.getRestaurantData()
  }

  convertItemsData = foodArray => {
    const item = {
      cost: foodArray.cost,
      foodType: foodArray.food_type,
      id: foodArray.id,
      imageUrl: foodArray.image_url,
      name: foodArray.name,
      rating: foodArray.rating,
    }

    return item
  }

  convertData = object => {
    const converted = {
      costForTwo: object.cost_for_two,
      cuisine: object.cuisine,
      foodItems: object.food_items.map(eachItem =>
        this.convertItemsData(eachItem),
      ),
      restaurantId: object.id,
      imageUrl: object.image_url,
      itemCount: object.items_count,
      location: object.location,
      name: object.name,
      opensAt: object.opens_at,
      rating: object.rating,
      reviewsCount: object.reviews_count,
    }
    return converted
  }

  getRestaurantData = async () => {
    this.setState({apiStatus: restaurantsApiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/restaurants-list/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)

    const data = await response.json()

    if (response.ok === true) {
      const convertedData = this.convertData(data)
      this.setState({
        apiStatus: restaurantsApiStatusConstants.success,
        restaurantData: convertedData,
        loadfooter: true,
      })
    }
  }

  restaurantsDisplayLoading = () => (
    <div testid="restaurant-details-loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  restaurantView = () => {
    const {restaurantData} = this.state

    const {
      costForTwo,
      name,
      restaurantId,
      cuisine,
      imageUrl,
      location,
      rating,
      reviewsCount,
    } = restaurantData

    return (
      <div className="restaurent-details-container">
        <div key={restaurantId} className="restaurent-container">
          <img src={imageUrl} alt="restaurant" className="restaurent-image" />
          <div>
            <h1 className="restaurent-name">{name}</h1>
            <p className="restaurent-cuisine">{cuisine}</p>
            <p className="restaurent-location">{location}</p>
            <div className="restarent-ratings-price-container">
              <div>
                <div className="rating-container">
                  <AiFillStar className="rating-icon" />
                  <p className="icon-description">{rating}</p>
                </div>
                <p className="icon-description">{reviewsCount}+ Ratings</p>
              </div>
              <hr className="hr" />
              <div>
                <div className="rating-container">
                  <BiRupee className="rating-icon" />
                  <p className="icon-description">{costForTwo}</p>
                </div>
                <p className="icon-description">Cost for two</p>
              </div>
            </div>
          </div>
        </div>
        {this.foodItemsView()}
      </div>
    )
  }

  foodItemsView = () => {
    const {restaurantData} = this.state
    const {foodItems} = restaurantData

    return (
      <ul className="food-item-container">
        {foodItems.map(eachItem => (
          <FoodItem key={eachItem.id} foodItem={eachItem} />
        ))}
      </ul>
    )
  }

  onRenderDisplayRestaurantDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case restaurantsApiStatusConstants.success:
        return this.restaurantView()
      case restaurantsApiStatusConstants.inProgress:
        return this.restaurantsDisplayLoading()
      case restaurantsApiStatusConstants.failure:
        return null
      default:
        return null
    }
  }

  render() {
    const {loadfooter} = this.state
    return (
      <>
        <div>
          <Header />
          {this.onRenderDisplayRestaurantDetails()}
          {loadfooter && <Footer />}
        </div>
      </>
    )
  }
}

export default RestaurantDetails
