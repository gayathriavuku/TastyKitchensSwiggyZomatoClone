import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Slider from 'react-slick'
import {v4 as uuidv4} from 'uuid'

import {BsFilterLeft} from 'react-icons/bs'
import {GoTriangleDown} from 'react-icons/go'
import {FaAngleLeft, FaAngleRight} from 'react-icons/fa'

import RestaurantCard from '../RestaurantCard'

import './index.css'

const sortByOptions = [
  {
    optionId: 'Highest',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'Lowest',
    displayText: 'Price (Low-High)',
  },
]

console.log(sortByOptions[0].optionId)

const carouselApiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const restaurantsApiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class AllRestaurantsSection extends Component {
  state = {
    carouselApiStatus: carouselApiStatusConstants.initial,
    carouselList: [],
    restaurantApiStatus: restaurantsApiStatusConstants.initial,
    restaurantsList: [],

    sortByValue: sortByOptions[1].optionId,
    activePage: 1,
    limit: 9,
  }

  componentDidMount() {
    this.getCarouselList()
    this.getAllRestaurantsList()
  }

  getCarouselList = async () => {
    this.setState({carouselApiStatus: carouselApiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = 'https://apis.ccbp.in/restaurants-list/offers'
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()

    const carouselsData = data.offers.map(each => ({
      imageUrl: each.image_url,
      id: uuidv4(),
    }))

    if (response.ok === true) {
      this.setState({
        carouselApiStatus: carouselApiStatusConstants.success,
        carouselList: carouselsData,
      })
    }
  }

  convertRestaurants = object => {
    const convertedRestaurent = {
      costForTwo: object.cost_for_two,
      cuisine: object.cuisine,
      groupByTime: object.group_by_time,
      hasOnlineDelivery: object.has_online_delivery,
      hasTableBooking: object.has_table_booking,
      id: object.id,
      imageUrl: object.image_url,
      isDeliveringNow: object.is_delivering_now,
      location: object.location,
      menuType: object.menu_type,
      name: object.name,
      opensAt: object.opens_at,
      userRating: {
        rating: object.user_rating.rating,
        ratingColor: object.user_rating.rating_color,
        ratingText: object.user_rating.rating_text,
        totalReviews: object.user_rating.total_reviews,
      },
    }
    return convertedRestaurent
  }

  getAllRestaurantsList = async () => {
    this.setState({
      restaurantApiStatus: restaurantsApiStatusConstants.inProgress,
    })
    const {sortByValue, activePage, limit} = this.state

    const jwtToken = Cookies.get('jwt_token')
    const offset = (activePage - 1) * limit

    const restaurantsApiUrl = `https://apis.ccbp.in/restaurants-list?offset=${offset}&limit=${limit}&sort_by_rating=${sortByValue}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(restaurantsApiUrl, options)

    if (response.ok === true) {
      const data = await response.json()

      const restaurants = data.restaurants.map(each =>
        this.convertRestaurants(each),
      )

      this.setState({
        restaurantApiStatus: restaurantsApiStatusConstants.success,
        restaurantsList: restaurants,
      })
    }
  }

  displayLoadingView = () => (
    <div testid="restaurants-list-loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  displayCarouselImages = () => {
    const {carouselList} = this.state

    const settings = {
      dots: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      speed: 700,
      infinite: true,
      dotsClass: 'slick-dots',
      autoplay: true,
      autoplaySpeed: 3000,
      adaptiveHeight: true,
    }
    return (
      <div>
        <Slider {...settings}>
          {carouselList.map(each => (
            <img src={each.imageUrl} alt="offer" key={each.id} />
          ))}
        </Slider>
      </div>
    )
  }

  renderCarousel = () => {
    const {carouselApiStatus} = this.state

    switch (carouselApiStatus) {
      case carouselApiStatusConstants.success:
        return this.displayCarouselImages()

      case carouselApiStatusConstants.inProgress:
        return this.displayLoadingView()

      default:
        return null
    }
  }

  decreasePage = () => {
    const {activePage} = this.state
    if (activePage > 1) {
      this.setState(
        prevState => ({activePage: prevState.activePage - 1}),
        this.getAllRestaurantsList,
      )
    }
  }

  increasePage = () => {
    this.setState(
      prevState => ({activePage: prevState.activePage + 1}),
      this.getAllRestaurantsList,
    )
  }

  renderRestaurantsView = () => {
    const {restaurantsList, activePage} = this.state
    console.log(restaurantsList)
    return (
      <>
        <ul className="restaurents-list">
          {restaurantsList.map(each => (
            <RestaurantCard key={each.id} restaurentData={each} />
          ))}
        </ul>
        <div className="pagination-container">
          <button type="button" className="pages" onClick={this.decreasePage}>
            <FaAngleLeft className="icon" testid="pagination-left-button" />
          </button>
          <p testid="active-page-number">{activePage}</p>
          <button type="button" className="pages" onClick={this.increasePage}>
            <FaAngleRight className="icon" testid="pagination-right-button" />
          </button>
        </div>
      </>
    )
  }

  restaurantsDisplayLoading = () => (
    <div testid="restaurants-offers-loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  changeTheSortByOptionValue = event => {
    this.setState({sortByValue: event.target.value}, this.getAllRestaurantsList)
  }

  renderRestaurants = () => {
    const {restaurantApiStatus} = this.state

    switch (restaurantApiStatus) {
      case restaurantsApiStatusConstants.success:
        return this.renderRestaurantsView()
      case restaurantsApiStatusConstants.inProgress:
        return this.restaurantsDisplayLoading()
      case restaurantsApiStatusConstants.failure:
        return this.noRestaurantsView()
      default:
        return null
    }
  }

  render() {
    const {sortByValue} = this.state
    return (
      <div>
        {this.renderCarousel()}
        <div className="popular-restaurants-container">
          <div className="popular-restaurant-head">
            <div>
              <h1 className="popular-head">Popular Restaurants</h1>
              <p className="popular-para">
                Popular Restaurants Select Your favourite restaurant special
                dish and make your day happy...
              </p>
            </div>
            <div className="sort-by-container">
              <BsFilterLeft className="filter-icon" />
              <p>Sort by</p>
              <select
                id="sortBy"
                onChange={this.changeTheSortByOptionValue}
                value={sortByValue}
                className="sort-by-select"
              >
                {sortByOptions.map(eachOption => (
                  <option key={eachOption.optionId}>
                    {eachOption.optionId}
                  </option>
                ))}
              </select>
              <GoTriangleDown className="triangle-down" />
            </div>
          </div>
        </div>
        {this.renderRestaurants()}
      </div>
    )
  }
}

export default AllRestaurantsSection
