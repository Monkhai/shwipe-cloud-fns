import { HttpsError, onCall } from 'firebase-functions/https'
import { error } from 'firebase-functions/logger'
import { logger } from '../logger'
import { db_updateGroupInvitation } from './db/db_updateGroupInvitation'
import { GroupInvitationStatus } from './groupInvitationTypes'
import { db_getGroupMembersPushToken } from '../groupMembers/db/db_getGroupMembersPushTokens'
import Expo, { ExpoPushMessage } from 'expo-server-sdk'
import { NotificationType } from '../notifications/notificationTypes'

type UpdateGroupInvitationRequest = {
  groupId: string
  status: GroupInvitationStatus
}

export const updateGroupInvitationFn = onCall<UpdateGroupInvitationRequest>(async request => {
  try {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated')
    }

    const userId = request.auth.uid
    const groupId = request.data.groupId
    const status = request.data.status

    await db_updateGroupInvitation(groupId, userId, status)

    const pushTokens = await db_getGroupMembersPushToken(groupId)
    const expo = new Expo()
    const messages: ExpoPushMessage[] = []
    pushTokens.forEach(p => {
      if (!Expo.isExpoPushToken(p)) return
      messages.push({
        to: p,
        priority: 'normal',
        sound: null,
        data: {
          type: NotificationType.GROUP_INVITATION_UPDATED,
        },
      })
    })

    const chunks = expo.chunkPushNotifications(messages)
    const promises = chunks.map(async c => await expo.sendPushNotificationsAsync(c))
    await Promise.all(promises)
  } catch (err) {
    logger.logError(`Error updating group invitation: ${err}`)
    error(err)
    throw new HttpsError('unknown', 'Error updating group invitation')
  }
})
