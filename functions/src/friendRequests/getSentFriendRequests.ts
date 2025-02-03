import { HttpsError, onCall } from 'firebase-functions/https'
import { logger } from '../logger'
import { db_getSentFriendRequests } from './db/db_getSentFriendRequests'
import { SafeFriendRequest } from './friendRequestTypes'

export const getSentFriendRequestsFn = onCall<null, Promise<SafeFriendRequest[]>>(async request => {
  if (!request.auth) {
    logger.logError('User not authenticated')
    throw new HttpsError('unauthenticated', 'User not authenticated')
  }
  try {
    const friendRequests = await db_getSentFriendRequests(request.auth.uid)
    return friendRequests
  } catch (err) {
    const errorMessage = `Error getting sent friend requests: ${err}`
    logger.logError(errorMessage)
    throw new HttpsError('internal', errorMessage)
  }
})
