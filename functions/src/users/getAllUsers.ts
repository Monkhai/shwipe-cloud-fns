import { HttpsError, onCall } from 'firebase-functions/https'
import { logger } from '../logger'
import { db_getAllUsers } from './db/db_getAllUsers'
import { SafeUser } from './userTypes'

type GetAllUsersResponse = Array<SafeUser>

export const getAllUsersFn = onCall<null, Promise<GetAllUsersResponse>>(async requset => {
  try {
    if (!requset.auth) {
      logger.logError('User not authenticated')
      throw new HttpsError('unauthenticated', 'User not authenticated')
    }
    const users = await db_getAllUsers(requset.auth.uid)
    return users
  } catch (err) {
    const errorMessage = `Error getting users: ${err}`
    logger.logError(errorMessage)
    throw new HttpsError('internal', errorMessage)
  }
})
