import { HttpsError, onCall } from 'firebase-functions/https'
import { FriendRequestsStatus } from './friendRequestTypes'
import { logger } from '../logger'
import { db_updateFriendRequest } from './db/db_updateFriendRequest'
import { db_insertFriendship } from '../friends/db/db_insertFriendship'
import { error } from 'firebase-functions/logger'

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

    if (request.data.status === FriendRequestsStatus.ACCEPTED) {
      await db_insertFriendship(request.auth.uid, request.data.friendRequestId)
    }
  } catch (err) {
    const errorMessage = `Error updating friend request ${request.data.friendRequestId}: ${err}`
    logger.logError(errorMessage)
    error(err)
    throw new HttpsError('internal', 'Error updating friend request')
  }
})
