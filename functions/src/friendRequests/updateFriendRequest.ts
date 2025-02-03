import { HttpsError, onCall } from 'firebase-functions/https'
import { error } from 'firebase-functions/logger'
import { logger } from '../logger'
import { db_updateFriendRequest } from './db/db_updateFriendRequest'
import { FriendRequestsStatus } from './friendRequestTypes'

type UpdateFriendRequestRequest = {
  friendRequestId: string
  status: FriendRequestsStatus
}

export const updateFriendRequestFn = onCall<UpdateFriendRequestRequest, Promise<void>>(async request => {
  try {
    if (!request.auth) {
      logger.logError('User not authenticated')
      throw new HttpsError('unauthenticated', 'User not authenticated')
    }

    await db_updateFriendRequest(request.auth.uid, request.data.friendRequestId, request.data.status)
  } catch (err) {
    const errorMessage = `Error updating friend request ${request.data.friendRequestId}: ${err}`
    logger.logError(errorMessage)
    error(err)
    throw new HttpsError('internal', 'Error updating friend request')
  }
})
