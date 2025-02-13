import { Client, PlacesNearbyRanking } from '@googlemaps/google-maps-services-js'
import { HttpsError, onCall } from 'firebase-functions/https'
import { error } from 'firebase-functions/logger'
import { logger } from '../logger'
import { MAPS_KEY } from '../secrets/mapsAPI'
import { Restaurant } from './restaurantTypes'
import { getNavigationLink, getRestaurantPhotoURL } from './restaurantUtils'

type GetPopularRestaurantsRequest = {
  latitude: number
  longitude: number
}

type GetPopularRestaurantsResponse = {
  restaurants: Restaurant[]
}

export const getPopularRestaurantsFn = onCall<GetPopularRestaurantsRequest, Promise<GetPopularRestaurantsResponse>>(
  { secrets: [MAPS_KEY] },
  async request => {
    try {
      if (!request.auth) {
        throw new HttpsError('unauthenticated', 'User is not authenticated')
      }

      const client = new Client()
      const key = MAPS_KEY.value()
      if (!key) {
        throw new HttpsError('internal', 'Maps API key is not set')
      }

      const { latitude, longitude } = request.data
      const response = await client.placesNearby({
        params: {
          key,
          location: `${latitude},${longitude}`,
          type: 'restaurant',
          rankby: PlacesNearbyRanking.prominence,
          radius: 10000, // 10 km
          opennow: true,
        },
      })

      const restaurants = response.data.results.map(result => {
        const navigationLinks = getNavigationLink(result)

        if (!navigationLinks) {
          return null
        }

        const photoURLs = result.photos?.map(photo => getRestaurantPhotoURL(photo.photo_reference, key)) ?? []

        return {
          ...result,
          photo_urls: photoURLs,
          navigation_links: navigationLinks,
        }
      }) as Restaurant[]

      const filteredRestaurants = restaurants.filter(restaurant => restaurant !== null).sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))

      return { restaurants: filteredRestaurants }
    } catch (err) {
      logger.logError(`getPopularRestaurantsFn\nError getting popular restaurants: ${err}`)
      error(err)
      throw err
    }
  }
)
