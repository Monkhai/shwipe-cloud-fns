import Expo from 'expo-server-sdk'
import { HttpsError, onCall } from 'firebase-functions/https'
import { error } from 'firebase-functions/logger'
import { logger } from '../logger'
import { db_getUserPushTokenFromPublicId } from '../users/db/db_getUserPushTokenFromPublicId'
import { NotificationType } from '../notifications/notificationTypes'

type SendSessionInvitationRequest = {
  sessionId: string
  userId: string // public
}

export const sendSessionInvitationFn = onCall<SendSessionInvitationRequest>(async request => {
  try {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User is not authenticated')
    }
    const { sessionId, userId: publicUserId } = request.data
    const pushToken = await db_getUserPushTokenFromPublicId(publicUserId)

    if (!pushToken) {
      throw new HttpsError('invalid-argument', 'User has no push token')
    }

    const expo = new Expo()

    await expo.sendPushNotificationsAsync([
      {
        to: pushToken,
        title: 'Session',
        body: 'You have been invited to a session',
        data: {
          type: NotificationType.SESSION_INVITATION,
          sessionId,
        },
      },
    ])
  } catch (err) {
    error(err)
    error(err)
    const errorMessage = `Failed to send session invitation: ${err}`
    logger.logError(errorMessage)
    throw err
  }
})
