import { Expo } from 'expo-server-sdk'
import { HttpsError, onCall } from 'firebase-functions/https'
import { error, log } from 'firebase-functions/logger'
import { logger } from '../logger'
import { db_getUserPushTokenFromPublicId } from '../users/db/db_getUserPushTokenFromPublicId'
import { db_insertFriendRequest } from './db/db_insertFriendRequest'
import { NotificationType } from '../notifications/notificationTypes'

type SendFriendRequestRequest = {
  publicId: string
}

export const sendFriendRequestFn = onCall<SendFriendRequestRequest, Promise<void>>(async request => {
  if (!request.auth) {
    logger.logError('User not authenticated')
    throw new HttpsError('unauthenticated', 'User not authenticated')
  }
  log('user authenticated')

  try {
    const pushToken = await db_getUserPushTokenFromPublicId(request.data.publicId)
    if (!pushToken) {
      throw new HttpsError('permission-denied', 'sendFriendRequestFn: User has no push token')
    }
    await db_insertFriendRequest(request.auth.uid, request.data.publicId)
    logger.logInfo(`Friend request sent to ${request.data.publicId}`)

    const expo = new Expo()
    await expo.sendPushNotificationsAsync([
      {
        to: pushToken,
        title: 'Friend Request',
        body: 'You have a new friend request',
        data: {
          type: NotificationType.FRIEND_REQUEST_SENT,
        },
      },
    ])
  } catch (err) {
    const errorMessage = `Error sending friend request: ${err}`
    logger.logError(errorMessage)
    error(err)
    throw new HttpsError('internal', errorMessage)
  }
})
