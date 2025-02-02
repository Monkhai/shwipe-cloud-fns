import { getPool } from '../../pool'
import { FriendRequestsStatus, FriendRequestsTable } from '../friendRequestTypes'

export async function db_insertFriendRequest(senderId: string, receiverId: string) {
  const pool = await getPool()
  const query = `INSERT INTO ${FriendRequestsTable.NAME} (${FriendRequestsTable.SENDER_ID}, ${FriendRequestsTable.RECEIVER_ID}, ${FriendRequestsTable.STATUS}) VALUES ($1, $2, ${FriendRequestsStatus.PENDING})`
  await pool.query(query, [senderId, receiverId])
}
