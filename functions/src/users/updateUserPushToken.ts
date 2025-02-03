import { HttpsError, onCall } from 'firebase-functions/https'
import { error } from 'firebase-functions/logger'
import { logger } from '../logger'
import { db_updateUserPushToken } from './db/db_updateUserPushToken'
type UpdateUserPushTokenRequest = {
  pushToken: string
}

export const updateUserPushTokenFn = onCall<UpdateUserPushTokenRequest, Promise<void>>(async request => {
  try {
    if (!request.auth) {
      logger.logError('User not authenticated')
      throw new HttpsError('unauthenticated', 'User not authenticated')
    }

    await db_updateUserPushToken(request.auth.uid, request.data.pushToken)
    logger.logInfo(`User push token updated for ${request.auth.uid}`)
  } catch (err) {
    const errorMessage = `Error updating user push token: ${err}`
    logger.logError(errorMessage)
    error(errorMessage)
    throw new HttpsError('internal', errorMessage)
  }
})
