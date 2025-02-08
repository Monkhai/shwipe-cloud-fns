import { HttpsError, onCall } from 'firebase-functions/https'
import { db_leaveGroup } from './db/db_leaveGroup'
import { logger } from '../logger'
import { error } from 'firebase-functions/logger'

type LeaveGroupRequest = {
  groupId: string
}
export const leaveGroupFn = onCall<LeaveGroupRequest, Promise<void>>(async request => {
  try {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated')
    }

    const groupId = request.data.groupId
    await db_leaveGroup(groupId, request.auth.uid)
  } catch (err) {
    logger.logError(`Error leaving group: ${err}`)
    error(err)
    throw err
  }
})
