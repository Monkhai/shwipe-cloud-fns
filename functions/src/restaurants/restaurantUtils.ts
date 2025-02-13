import { PlaceData } from '@googlemaps/google-maps-services-js'
import { NavigationLinks } from './restaurantTypes'

export function getNavigationLink(place: Partial<PlaceData>) {
  if (!place.name || !place.place_id || !place.geometry) {
    return null
  }

  const name = encodeURIComponent(place.name)
  const navigationLinks: NavigationLinks = {
    google_maps: `https://www.google.com/maps/search/?api=1&query=${name}&query_place_id=${place.place_id}`,
    apple_maps: `maps://?ll=${place.geometry.location.lat},${place.geometry.location.lng}&q=${name}`,
    waze: `https://waze.com/ul/${place.place_id}`,
  }

  return navigationLinks
}

export function getRestaurantPhotoURL(photoReference: string, key: string): string {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${key}`
}
