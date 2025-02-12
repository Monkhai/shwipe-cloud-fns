import { HttpsError, onCall } from 'firebase-functions/https'
import { logger } from '../logger'
import { error } from 'firebase-functions/logger'
import { auth } from 'firebase-admin'
import { db_deleteUser } from './db/db_deleteUser'

export const deleteAccountFn = onCall(async req => {
  try {
    if (!req.auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated')
    }

    const userId = req.auth.uid
    await auth().deleteUser(userId)
    await db_deleteUser(userId)
  } catch (err) {
    logger.logError(`deleteAccount\nError deleting account: ${err}`)
    error(err)
    throw err
  }
})
