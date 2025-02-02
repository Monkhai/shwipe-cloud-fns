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
    // find the actual user id from the public id
    const userQuery = `SELECT ${PublicUserIdsTable.ID} FROM ${PublicUserIdsTable.NAME} WHERE ${PublicUserIdsTable.PUBLIC_ID} = $1`
    const userResult = await client.query(userQuery, [receiverPublicId])
    if (userResult.rows.length === 0) {
      logger.logError(`User with public id ${receiverPublicId} not found`)
      throw new HttpsError('not-found', `User with public id ${receiverPublicId} not found`)
    }
    const receiverId = userResult.rows[0][PublicUserIdsTable.ID]

    // insert the friend request
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
