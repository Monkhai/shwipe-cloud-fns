import { HttpsError, onCall } from 'firebase-functions/https'
import { db_getUserFriendships } from './db/db_getUserFriendships'
import { SafeFriend } from './friendsTypes'
import { logger } from '../logger'
import { error } from 'firebase-functions/logger'

type GetUserFriendshipsResponse = Array<SafeFriend>

export const getUserFriendshipsFn = onCall<null, Promise<GetUserFriendshipsResponse>>(async request => {
  try {
    if (!request.auth) {
      logger.logError('User not authenticated')
      throw new HttpsError('unauthenticated', 'User not authenticated')
    }

    const userId = request.auth.uid
    const friends = await db_getUserFriendships(userId)
    return friends
  } catch (err) {
    const errorMessage = `Error getting user friendships for user ${request.auth?.uid}: ${err}`
    logger.logError(errorMessage)
    error(errorMessage)
    throw err
  }
})
