import { getPool } from '../../pool'
import { FriendRequestsStatus, FriendRequestsTable } from '../friendRequestTypes'
import { FriendRequest } from '../friendRequestTypes'

export async function db_getSentFriendRequests(userId: string): Promise<FriendRequest[]> {
  const pool = await getPool()
  const query = `SELECT * FROM ${FriendRequestsTable.NAME} WHERE ${FriendRequestsTable.SENDER_ID} = $1 AND ${FriendRequestsTable.STATUS} = '${FriendRequestsStatus.PENDING}'`
  const result = await pool.query(query, [userId])
  return result.rows.map(row => ({
    id: row[FriendRequestsTable.ID],
    sender_id: row[FriendRequestsTable.SENDER_ID],
    receiver_id: row[FriendRequestsTable.RECEIVER_ID],
    status: row[FriendRequestsTable.STATUS],
  }))
}
