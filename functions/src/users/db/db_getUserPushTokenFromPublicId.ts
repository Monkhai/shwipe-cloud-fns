import { getPool } from '../../pool'
import { UsersTable } from '../userTypes'
import { PublicUserIdsTable } from '../../publicUserIds/publicUserIdsTypes'

export async function db_getUserPushTokenFromPublicId(publicId: string): Promise<string | null> {
  const pool = await getPool()
  try {
    const query = `--sql
    SELECT
      u.${UsersTable.EXPO_PUSH_TOKEN}
    FROM ${UsersTable.NAME} u
    INNER JOIN ${PublicUserIdsTable.NAME} pui ON pui.${PublicUserIdsTable.ID} = u.${UsersTable.ID}
    WHERE pui.${PublicUserIdsTable.PUBLIC_ID} = $1`

    const result = await pool.query(query, [publicId])
    return result.rows[0][UsersTable.EXPO_PUSH_TOKEN]
  } finally {
    await pool.end()
  }
}
