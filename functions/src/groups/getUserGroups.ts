import { HttpsError, onCall } from 'firebase-functions/https'
import { ClientGroup } from './groupTypes'
import { error } from 'firebase-functions/logger'
import { logger } from '../logger'
import { db_getUserGroups } from './db/db_getUserGroups'

type GetUserGroupsResponse = {
  groups: Array<ClientGroup>
}

export const getUserGroupsFn = onCall<null, Promise<GetUserGroupsResponse>>(async request => {
  try {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated')
    }

    const userId = request.auth.uid
    const groups = await db_getUserGroups(userId)
    return { groups }
  } catch (err) {
    const errorMessage = `Failed to get user groups: ${err}`
    error(err)
    logger.logError(errorMessage)
    throw err
  }
})
