import { HttpsError, onCall } from 'firebase-functions/https'
import { error, log } from 'firebase-functions/logger'
import { logger } from '../logger'
import { db_insertFriendRequest } from './db/db_insertFriendRequest'

type SendFriendRequestRequest = {
  publicId: string
}

export const sendFriendRequestFn = onCall<SendFriendRequestRequest, Promise<void>>(async request => {
  if (!request.auth) {
    logger.logError('User not authenticated')
    throw new HttpsError('unauthenticated', 'User not authenticated')
  }
  log('user authenticated')

  try {
    await db_insertFriendRequest(request.auth.uid, request.data.publicId)
    logger.logInfo(`Friend request sent to ${request.data.publicId}`)
  } catch (err) {
    const errorMessage = `Error sending friend request: ${err}`
    logger.logError(errorMessage)
    error(err)
    throw new HttpsError('internal', errorMessage)
  }
})
