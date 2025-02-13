import { PlaceData } from '@googlemaps/google-maps-services-js'

export interface NavigationLinks {
  google_maps: string
  apple_maps: string
  waze: string
}

export interface Restaurant extends Partial<PlaceData> {
  photo_urls: Array<string>
  navigation_links: NavigationLinks
}
