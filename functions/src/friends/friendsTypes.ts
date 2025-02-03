import { SafeUser } from '../users/userTypes'

export enum FriendsTable {
  NAME = 'friendships',
  ID = 'id',
  USER_1_ID = 'user1_id',
  USER_2_ID = 'user2_id',
}

export type SafeFriend = SafeUser
