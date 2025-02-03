import { FriendsTable, SafeFriend } from '../friendsTypes'
import { UsersTable } from '../../users/userTypes'
import { getPool } from '../../pool'
import { PublicUserIdsTable } from '../../publicUserIds/publicUserIdsTypes'

export async function db_getUserFriendships(userId: string): Promise<SafeFriend[]> {
  const pool = await getPool()
  try {
    const query = `
    SELECT DISTINCT 
      u.${UsersTable.DISPLAY_NAME},
      u.${UsersTable.PHOTO_URL},
      p.${PublicUserIdsTable.PUBLIC_ID} as public_id
    FROM ${FriendsTable.NAME} f
    JOIN ${UsersTable.NAME} u ON (
      CASE 
        WHEN f.${FriendsTable.USER_1_ID} = $1 THEN f.${FriendsTable.USER_2_ID}
        ELSE f.${FriendsTable.USER_1_ID}
      END = u.${UsersTable.ID}
    )
    JOIN ${PublicUserIdsTable.NAME} p ON u.${UsersTable.ID} = p.${PublicUserIdsTable.ID}
    WHERE f.${FriendsTable.USER_1_ID} = $1 OR f.${FriendsTable.USER_2_ID} = $1`

    const result = await pool.query(query, [userId])
    return result.rows.map(row => ({
      id: row[PublicUserIdsTable.PUBLIC_ID],
      display_name: row[UsersTable.DISPLAY_NAME],
      photo_url: row[UsersTable.PHOTO_URL],
    }))
  } finally {
    pool.end()
  }
}
