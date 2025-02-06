import { HttpsError, onCall } from 'firebase-functions/https'
import { db_createGroup } from './db/db_createGroup'
import { logger } from '../logger'
import { error } from 'firebase-functions/logger'

type CreateGroupRequest = {
  groupName: string
}

export const createGroupFn = onCall<CreateGroupRequest, void>(async request => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated')
  }

  try {
    const userId = request.auth.uid
    const groupName = request.data.groupName
    await db_createGroup(userId, groupName)
  } catch (err) {
    logger.logError(`Error creating group: ${err}`)
    error(err)
    throw new HttpsError('unknown', 'Error creating group')
  }
})
