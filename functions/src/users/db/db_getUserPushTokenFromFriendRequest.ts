import { FriendRequestsTable } from '../../friendRequests/friendRequestTypes'
import { getPool } from '../../pool'
import { UsersTable } from '../userTypes'

export async function db_getUserPushTokenFromFriendRequest(friendRequestId: string, userId: string) {
  const pool = await getPool()
  try {
    const query = `--sql
    SELECT 
      CASE 
        WHEN fr.${FriendRequestsTable.SENDER_ID} = $2 THEN sender.${UsersTable.EXPO_PUSH_TOKEN}
        ELSE receiver.${UsersTable.EXPO_PUSH_TOKEN}
      END as push_token
    FROM ${FriendRequestsTable.NAME} fr
    INNER JOIN ${UsersTable.NAME} sender 
      ON sender.${UsersTable.ID} = fr.${FriendRequestsTable.SENDER_ID}
    INNER JOIN ${UsersTable.NAME} receiver 
      ON receiver.${UsersTable.ID} = fr.${FriendRequestsTable.RECEIVER_ID}
    WHERE fr.${FriendRequestsTable.ID} = $1
      AND (sender.${UsersTable.ID} = $2 OR receiver.${UsersTable.ID} = $2)
    `

    const result = await pool.query(query, [friendRequestId, userId])
    return result.rows[0]?.push_token
  } finally {
    await pool.end()
  }
}
