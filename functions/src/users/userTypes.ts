export enum UsersTable {
  NAME = 'users',
  ID = 'id',
  DISPLAY_NAME = 'display_name',
  PHOTO_URL = 'photo_url',
  EXPO_PUSH_TOKEN = 'expo_push_token',
}

export type User = {
  id: string
  display_name: string
  photo_url: string
  expo_push_token: string
}

export type SafeUser = Omit<User, 'expo_push_token'>
