import Expo from 'expo-server-sdk'
import { HttpsError, onCall } from 'firebase-functions/https'
import { error } from 'firebase-functions/logger'
import { logger } from '../logger'
import { NotificationType } from '../notifications/notificationTypes'
import { db_getUserPushTokenFromFriendRequest } from '../users/db/db_getUserPushTokenFromFriendRequest'
import { db_updateFriendRequest } from './db/db_updateFriendRequest'
import { FriendRequestsStatus } from './friendRequestTypes'

type UpdateFriendRequestRequest = {
  friendRequestId: string
  status: FriendRequestsStatus
}

export const updateFriendRequestFn = onCall<UpdateFriendRequestRequest, Promise<void>>(async request => {
  try {
    if (!request.auth) {
      logger.logError('User not authenticated')
      throw new HttpsError('unauthenticated', 'User not authenticated')
    }

    const pushToken = await db_getUserPushTokenFromFriendRequest(request.data.friendRequestId, request.auth.uid)
    if (!pushToken) {
      throw new HttpsError('permission-denied', 'updateFriendRequestFn: User has no push token')
    }
    await db_updateFriendRequest(request.auth.uid, request.data.friendRequestId, request.data.status)

    const expo = new Expo()
    await expo.sendPushNotificationsAsync([
      {
        to: pushToken,
        title: 'Friend Request Updated',
        body: 'Your friend request has been updated',
        data: {
          type: NotificationType.FRIEND_REQUEST_UPDATED,
        },
      },
    ])
  } catch (err) {
    const errorMessage = `Error updating friend request ${request.data.friendRequestId}: ${err}`
    logger.logError(errorMessage)
    error(err)
    throw new HttpsError('internal', 'Error updating friend request')
  }
})
