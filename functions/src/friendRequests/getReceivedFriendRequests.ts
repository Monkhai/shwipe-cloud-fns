import { HttpsError, onCall } from 'firebase-functions/https'
import { logger } from '../logger'
import { db_getReceivedFriendRequests } from './db/db_getReceivedFriendRequests'
import { SafeFriendRequest } from './friendRequestTypes'

export const getReceivedFriendRequestsFn = onCall<null, Promise<SafeFriendRequest[]>>(async request => {
  if (!request.auth) {
    logger.logError('User not authenticated')
    throw new HttpsError('unauthenticated', 'User not authenticated')
  }
  try {
    const friendRequests = await db_getReceivedFriendRequests(request.auth.uid)
    return friendRequests
  } catch (err) {
    const errorMessage = `Error getting received friend requests: ${err}`
    logger.logError(errorMessage)
    throw new HttpsError('internal', errorMessage)
  }
})
