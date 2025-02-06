import { HttpsError, onCall } from 'firebase-functions/https'
import { db_getUserIdFromPublicId } from '../publicUserIds/db/db_getUserIdFromPublicId'
import Expo from 'expo-server-sdk'
import { db_getUserPushTokenFromPublicId } from '../users/db/db_getUserPushTokenFromPublicId'
import { NotificationType } from '../notifications/notificationTypes'
import { logger } from '../logger'
import { error } from 'firebase-functions/logger'

type SendGroupInvitationRequest = {
  groupId: string
  publicId: string
}

export const sendGroupInvitationFn = onCall<SendGroupInvitationRequest, void>(async request => {
  try {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated')
    }

    const groupId = request.data.groupId
    const publicId = request.data.publicId
    const pushToken = await db_getUserPushTokenFromPublicId(publicId)
    if (!pushToken) {
      const userId = await db_getUserIdFromPublicId(publicId)
      throw new HttpsError('not-found', 'User push token not found for', userId)
    }

    const expo = new Expo()
    await expo.sendPushNotificationsAsync([
      {
        to: pushToken,
        title: 'Group Invitation',
        body: 'You have been invited to join a group',
        data: {
          type: NotificationType.GROUP_INVITATION,
          groupId,
        },
      },
    ])
  } catch (err) {
    logger.logError(`Error sending group invitation: ${err}`)
    error(err)
    throw new HttpsError('unknown', 'Error sending group invitation')
  }
})
