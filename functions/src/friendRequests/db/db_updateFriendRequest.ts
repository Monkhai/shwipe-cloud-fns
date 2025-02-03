import { HttpsError } from 'firebase-functions/https'
import { getPool } from '../../pool'
import { FriendRequestsStatus, FriendRequestsTable } from '../friendRequestTypes'
import { logger } from '../../logger'

export async function db_updateFriendRequest(userId: string, friendRequestId: string, status: FriendRequestsStatus) {
  try {
    const pool = await getPool()

    const verifyQuery = `--sql
    SELECT ${FriendRequestsTable.SENDER_ID} FROM ${FriendRequestsTable.NAME} WHERE ${FriendRequestsTable.ID} = $1`
    const verifyResult = await pool.query(verifyQuery, [friendRequestId])

    const receiverId = verifyResult.rows[0][FriendRequestsTable.RECEIVER_ID]
    if (receiverId !== userId) {
      const errorMessage = `User ${userId} not allowed to update friend request ${verifyResult.rows}`
      logger.logError(errorMessage)
      throw new HttpsError('permission-denied', errorMessage)
    }

    const updateQuery = `--sql
    UPDATE ${FriendRequestsTable.NAME}
      SET ${FriendRequestsTable.STATUS} = $1
      WHERE ${FriendRequestsTable.ID} = $2`

    await pool.query(updateQuery, [status, friendRequestId])
  } catch (err) {
    const errorMessage = `Error updating friend request ${friendRequestId} for user ${userId}: ${err}`
    logger.logError(errorMessage)
    throw new HttpsError('internal', errorMessage)
  }
}
