import { getPool } from '../../pool'
import { UsersTable } from '../../users/userTypes'
import { FriendRequestsTable, SafeFriendRequest } from '../friendRequestTypes'

export async function db_getReceivedFriendRequests(userId: string): Promise<SafeFriendRequest[]> {
  const pool = await getPool()
  const query = `--sql
  SELECT 
    fr.${FriendRequestsTable.ID} as request_id,
    fr.${FriendRequestsTable.STATUS} as status,
    u.${UsersTable.DISPLAY_NAME} as display_name,
    u.${UsersTable.PHOTO_URL} as photo_url
  FROM ${FriendRequestsTable.NAME} fr
  INNER JOIN ${UsersTable.NAME} u ON u.${UsersTable.ID} = fr.${FriendRequestsTable.SENDER_ID}
  WHERE fr.${FriendRequestsTable.RECEIVER_ID} = $1
    AND fr.${FriendRequestsTable.STATUS} = $2`

  const result = await pool.query(query, [userId])

  return result.rows.map(row => ({
    request_id: row.request_id,
    status: row.status,
    display_name: row.display_name,
    photo_url: row.photo_url,
  }))
}
