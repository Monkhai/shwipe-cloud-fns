import { HttpsError } from 'firebase-functions/https'
import { logger } from '../../logger'
import { getPool } from '../../pool'
import { PublicUserIdsTable } from '../../publicUserIds/publicUserIdsTypes'
import { FriendRequestsStatus, FriendRequestsTable } from '../friendRequestTypes'

export async function db_insertFriendRequest(senderId: string, receiverPublicId: string) {
  const pool = await getPool()
  const client = await pool.connect()

  client.query('BEGIN')

  try {
    const userQuery = `SELECT ${PublicUserIdsTable.ID} FROM ${PublicUserIdsTable.NAME} WHERE ${PublicUserIdsTable.PUBLIC_ID} = $1`
    const userResult = await client.query(userQuery, [receiverPublicId])
    if (userResult.rows.length === 0) {
      logger.logError(`User with public id ${receiverPublicId} not found`)
      throw new HttpsError('not-found', `User with public id ${receiverPublicId} not found`)
    }
    const receiverId = userResult.rows[0][PublicUserIdsTable.ID]

    // check if there is already any type of request between the two users
    const existingRequestQuery = `--sql
    SELECT 1 FROM ${FriendRequestsTable.NAME} WHERE (${FriendRequestsTable.SENDER_ID} = $1 AND ${FriendRequestsTable.RECEIVER_ID} = $2) OR (${FriendRequestsTable.SENDER_ID} = $2 AND ${FriendRequestsTable.RECEIVER_ID} = $1)`
    const existingRequestResult = await client.query(existingRequestQuery, [senderId, receiverId])
    if (existingRequestResult.rows.length > 0) {
      logger.logError(`Friend request already exists between ${senderId} and ${receiverId}`)
      throw new HttpsError('already-exists', `Friend request already exists between ${senderId} and ${receiverId}`)
    }

    const query = `--sql
    INSERT INTO ${FriendRequestsTable.NAME}
      (${FriendRequestsTable.SENDER_ID}, ${FriendRequestsTable.RECEIVER_ID}, ${FriendRequestsTable.STATUS})
      VALUES ($1, $2, $3::friend_request_status)`
    await client.query(query, [senderId, receiverId, FriendRequestsStatus.PENDING])

    await client.query('COMMIT')
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}
