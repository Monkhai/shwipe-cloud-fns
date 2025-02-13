import { Client } from '@googlemaps/google-maps-services-js'
import { HttpsError, onCall } from 'firebase-functions/https'
import { error } from 'firebase-functions/logger'
import { logger } from '../logger'
import { MAPS_KEY } from '../secrets/mapsAPI'
import { Restaurant } from './restaurantTypes'
import { getNavigationLink, getRestaurantPhotoURL } from './restaurantUtils'

type GetRestaurantProfileRequest = {
  placeId: string
}

type GetRestaurantProfileResponse = {
  restaurant: Restaurant
}

export const getRestaurantDetailsFn = onCall<GetRestaurantProfileRequest, Promise<GetRestaurantProfileResponse>>(
  { secrets: [MAPS_KEY] },
  async req => {
    try {
      if (!req.auth) {
        throw new HttpsError('unauthenticated', 'User is not authenticated')
      }

      const { placeId } = req.data

      const client = new Client()
      const key = MAPS_KEY.value()
      if (!key) {
        throw new HttpsError('internal', 'Maps API key is not set')
      }

      const response = await client.placeDetails({
        params: {
          key,
          place_id: placeId,
        },
      })

      const navigationLinks = getNavigationLink(response.data.result)
      if (!navigationLinks) {
        throw new HttpsError('internal', 'Navigation links are not set')
      }

      const photoURLs = response.data.result.photos?.map(photo => getRestaurantPhotoURL(photo.photo_reference, key)) ?? []

      const restaurant: Restaurant = {
        ...response.data.result,
        navigation_links: navigationLinks,
        photo_urls: photoURLs,
      }

      return { restaurant }
    } catch (err) {
      logger.logError(`getRestaurantProfileFn\nError getting restaurant profile: ${err}`)
      error(err)
      throw err
    }
  }
)
