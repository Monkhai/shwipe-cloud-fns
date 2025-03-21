import { HttpsError } from 'firebase-functions/v1/https'
import { getPool } from '../../pool'
import { PublicUserIdsTable } from '../../publicUserIds/publicUserIdsTypes'
import { SafeUser, UsersTable } from '../userTypes'
import { FriendsTable } from '../../friends/friendsTypes'

export async function db_getSafeUserFromPublicId(publicId: string, currentUserId: string): Promise<SafeUser & { isFriend: boolean }> {
  const pool = await getPool()
  try {
    const query = `--sql
    SELECT
      pu.${PublicUserIdsTable.PUBLIC_ID},
      u.${UsersTable.DISPLAY_NAME},
      u.${UsersTable.PHOTO_URL},
      EXISTS (
          SELECT 1
          FROM ${FriendsTable.NAME} f
          WHERE ((f.${FriendsTable.USER_1_ID} = $2 AND f.${FriendsTable.USER_2_ID} = u.${UsersTable.ID})
          OR (f.${FriendsTable.USER_1_ID} = u.${UsersTable.ID} AND f.${FriendsTable.USER_2_ID} = $2))
      ) as is_friend
    FROM ${PublicUserIdsTable.TABLE_NAME} pu
    INNER JOIN ${UsersTable.TABLE_NAME} u ON pu.${PublicUserIdsTable.ID} = u.${UsersTable.ID}
    WHERE pu.${PublicUserIdsTable.PUBLIC_ID} = $1
    `
    const result = await pool.query(query, [publicId, currentUserId])
    const user = result.rows[0]
    if (!user) {
      throw new HttpsError('not-found', 'User not found')
    }
    const safeUser: SafeUser & { isFriend: boolean } = {
      id: user[PublicUserIdsTable.PUBLIC_ID],
      display_name: user[UsersTable.DISPLAY_NAME],
      photo_url: user[UsersTable.PHOTO_URL],
      isFriend: user.is_friend,
    }
    return safeUser
  } finally {
    await pool.end()
  }
}
