import { getPool } from '../../pool'
import { PublicUserIdsTable } from '../../publicUserIds/publicUserIdsTypes'
import { FriendsTable } from '../friendsTypes'

export async function db_removeFriendship(userId: string, publicFriendId: string) {
  const pool = await getPool()
  const query = `--sql
    SELECT ${PublicUserIdsTable.ID} FROM ${PublicUserIdsTable.TABLE_NAME}
    WHERE ${PublicUserIdsTable.PUBLIC_ID} = $2
    AS friend_id

    DELETE FROM ${FriendsTable.NAME}
    WHERE (${FriendsTable.USER_1_ID} = $1 AND ${FriendsTable.USER_2_ID} = friend_id)
    OR (${FriendsTable.USER_1_ID} = friend_id AND ${FriendsTable.USER_2_ID} = $1)
  `
  try {
    await pool.query(query, [userId, publicFriendId])
  } finally {
    await pool.end()
  }
}
