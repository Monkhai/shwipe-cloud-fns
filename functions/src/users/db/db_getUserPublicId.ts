import { getPool } from '../../pool'
import { PublicUserIdsTable } from '../../publicUserIds/publicUserIdsTypes'

export async function db_getUserPublicId(userId: string) {
  const pool = await getPool()
  try {
    const result = await pool.query(
      `SELECT ${PublicUserIdsTable.PUBLIC_ID} FROM ${PublicUserIdsTable.TABLE_NAME} WHERE ${PublicUserIdsTable.ID} = $1`,
      [userId]
    )
    return result.rows[0][PublicUserIdsTable.PUBLIC_ID]
  } finally {
    await pool.end()
  }
}
