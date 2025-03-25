import { HttpsError, onCall } from 'firebase-functions/https'
import { db_removeFriendship } from './db/db_removeFriendship'
import { logger } from '../logger'
import { error } from 'firebase-functions/logger'

type RemoveFriendshipRequest = {
  friendId: string // public id
}

export const removeFriendshipFn = onCall<RemoveFriendshipRequest, Promise<void>>(async request => {
  const { friendId } = request.data

  try {
    if (!request.auth) {
      logger.logError('User not authenticated')
      throw new HttpsError('unauthenticated', 'User not authenticated')
    }

    await db_removeFriendship(request.auth.uid, friendId)
  } catch (err) {
    logger.logError(`Error removing friendship: ${err}`)
    error(err)
    throw new HttpsError('unknown', 'Error removing friendship')
  }
})
