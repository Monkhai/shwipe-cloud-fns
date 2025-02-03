import { User } from '../users/userTypes'

export enum FriendRequestsTable {
  NAME = 'friend_requests',
  ID = 'id',
  SENDER_ID = 'sender_id',
  RECEIVER_ID = 'receiver_id',
  STATUS = 'status',
}

export enum FriendRequestsStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

export type FriendRequest = {
  id: string
  sender_id: string
  receiver_id: string
  status: FriendRequestsStatus
}

export enum FriendRequestResult {
  REQUEST_ID = 'request_id',
  USER_ID = 'user_id',
  STATUS = 'status',
  DISPLAY_NAME = 'display_name',
  PHOTO_URL = 'photo_url',
}

export type SafeFriendRequest = Omit<User, 'id'> & {
  request_id: string
  user_id: string
  status: FriendRequestsStatus
}
