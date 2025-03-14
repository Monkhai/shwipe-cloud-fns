import { HttpsError, onCall } from 'firebase-functions/https'
import { SafeUser } from './userTypes'
import { logger } from '../logger'
import { error } from 'firebase-functions/logger'
import { db_getSafeUserFromPublicId } from './db/db_getSafeUserFromPublicId'

type GetUserRequest = {
  publicId: string
}

type GetUserResponse = {
  user: SafeUser
}

export const getUserFn = onCall<GetUserRequest, Promise<GetUserResponse>>(async request => {
  try {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'getUserFn: User not authenticated')
    }
    const user = await db_getSafeUserFromPublicId(request.data.publicId, request.auth.uid)
    return { user }
  } catch (err) {
    const errMessage = `getUserFn: ${err}`
    logger.logError(errMessage)
    error(errMessage)
    throw err
  }
})
