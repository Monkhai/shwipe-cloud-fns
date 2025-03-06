import { HttpsError, onCall } from 'firebase-functions/https'
import { logger } from '../logger'
import { db_getUserPublicId } from './db/db_getUserPublicId'
import { error } from 'firebase-functions/logger'

export const getPublicIdFn = onCall<null, Promise<string>>(async request => {
  try {
    if (!request.auth) {
      error(request.auth)
      logger.logError('User not authenticated')
      throw new HttpsError('unauthenticated', 'User not authenticated')
    }

    const userId = request.auth.uid
    const publicId = await db_getUserPublicId(userId)
    return publicId
  } catch (err) {
    const errorMessage = `Error getting publicId: ${err}`
    logger.logError(errorMessage)
    error(errorMessage)
    throw new HttpsError('internal', errorMessage)
  }
})
