export enum UsersTable {
  NAME = 'users',
  ID = 'id',
  DISPLAY_NAME = 'display_name',
  PHOTO_URL = 'photo_url',
}

export type User = {
  id: string
  display_name: string
  photo_url: string
}

export type SafeUser = Omit<User, 'id'>
