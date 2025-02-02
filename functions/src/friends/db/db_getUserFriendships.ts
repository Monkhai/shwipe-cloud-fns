import { getPool } from '../../pool'
import { FriendsTable, SafeFriend } from '../friendsTypes'
import { UsersTable } from '../../users/userTypes'

export async function db_getUserFriendships(userId: string): Promise<SafeFriend[]> {
  const pool = await getPool()

  const query = `
    SELECT DISTINCT 
      u.${UsersTable.DISPLAY_NAME},
      u.${UsersTable.PHOTO_URL}
    FROM ${FriendsTable.NAME} f
    JOIN ${UsersTable.NAME} u ON 
      CASE 
        WHEN f.${FriendsTable.USER_1_ID} = $1 THEN u.${UsersTable.ID} = f.${FriendsTable.USER_2_ID}
        ELSE u.${UsersTable.ID} = f.${FriendsTable.USER_1_ID}
      END
    WHERE f.${FriendsTable.USER_1_ID} = $1 OR f.${FriendsTable.USER_2_ID} = $1`

  const result = await pool.query(query, [userId])
  return result.rows.map(row => {
    return {
      display_name: row[UsersTable.DISPLAY_NAME],
      photo_url: row[UsersTable.PHOTO_URL],
    }
  })
}
