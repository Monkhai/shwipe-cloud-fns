import { getPool } from '../../pool'
import { FriendRequestResult, FriendRequestsStatus, FriendRequestsTable, SafeFriendRequest } from '../friendRequestTypes'
import { UsersTable } from '../../users/userTypes'
import { PublicUserIdsTable } from '../../publicUserIds/publicUserIdsTypes'

export async function db_getSentFriendRequests(userId: string): Promise<SafeFriendRequest[]> {
  const pool = await getPool()
  try {
    const query = `--sql
    SELECT 
      fr.${FriendRequestsTable.ID} as request_id,
    fr.${FriendRequestsTable.STATUS} as status,
    u.${UsersTable.DISPLAY_NAME} as display_name,
    u.${UsersTable.PHOTO_URL} as photo_url,
    pui.${PublicUserIdsTable.PUBLIC_ID} as user_id
  FROM ${FriendRequestsTable.NAME} fr
  INNER JOIN ${UsersTable.NAME} u ON u.${UsersTable.ID} = fr.${FriendRequestsTable.RECEIVER_ID}
  INNER JOIN ${PublicUserIdsTable.NAME} pui ON pui.${PublicUserIdsTable.ID} = u.${UsersTable.ID}
  WHERE fr.${FriendRequestsTable.SENDER_ID} = $1
    AND fr.${FriendRequestsTable.STATUS} = $2`

    const result = await pool.query(query, [userId, FriendRequestsStatus.PENDING])
    return result.rows.map(row => ({
      request_id: row[FriendRequestResult.REQUEST_ID],
      status: row[FriendRequestResult.STATUS],
      display_name: row[FriendRequestResult.DISPLAY_NAME],
      photo_url: row[FriendRequestResult.PHOTO_URL],
      user_id: row[FriendRequestResult.USER_ID],
    }))
  } finally {
    await pool.end()
  }
}
