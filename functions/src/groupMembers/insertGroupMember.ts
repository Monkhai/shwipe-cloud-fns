import { HttpsError, onCall } from 'firebase-functions/https'
import { logger } from '../logger'
import { error } from 'firebase-functions/logger'
import { db_insertGroupUser } from './db/db_insertGroupMember'

type InsertGroupMemberRequest = {
  groupId: string
}

export const insertGroupMemberFn = onCall<InsertGroupMemberRequest, void>(async request => {
  try {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated')
    }

    const userId = request.auth.uid
    const groupId = request.data.groupId

    await db_insertGroupUser(groupId, userId)
  } catch (err) {
    logger.logError(`Error inserting group member: ${err}`)
    error(err)
    throw new HttpsError('unknown', 'Error inserting group member')
  }
})
