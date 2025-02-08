import { HttpsError, onCall } from 'firebase-functions/https'
import { logger } from '../logger'
import { error } from 'firebase-functions/logger'
import { db_cancelGroupInvitation } from './db/db_cancelGroupInvitation'

type CancelGroupInvitationRequest = {
  groupId: string
  userId: string
}

export const cancelGroupInvitationFn = onCall<CancelGroupInvitationRequest, Promise<void>>(async request => {
  try {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated')
    }

    const groupId = request.data.groupId
    const publicUserId = request.data.userId

    await db_cancelGroupInvitation(groupId, publicUserId)
  } catch (err) {
    logger.logError(`Error cancelling group invitation: ${err}`)
    error(err)
    throw err
  }
})
