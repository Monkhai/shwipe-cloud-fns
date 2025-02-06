import { getPool } from '../../pool'
import { SafeUser, UsersTable } from '../userTypes'
import { PublicUserIdsTable } from '../../publicUserIds/publicUserIdsTypes'

export async function db_getAllUsers(userId: string): Promise<SafeUser[]> {
  const pool = await getPool()
  try {
    const query = `--sql
      SELECT
        u.${UsersTable.DISPLAY_NAME}, 
        u.${UsersTable.PHOTO_URL},
        p.${PublicUserIdsTable.PUBLIC_ID} as id
      FROM ${UsersTable.TABLE_NAME} u
      JOIN ${PublicUserIdsTable.TABLE_NAME} p ON u.${UsersTable.ID} = p.${PublicUserIdsTable.ID}
      WHERE u.${UsersTable.ID} != $1
    `
    const result = await pool.query(query, [userId])

    return result.rows.map(row => ({
      id: row.id,
      display_name: row[UsersTable.DISPLAY_NAME],
      photo_url: row[UsersTable.PHOTO_URL],
    }))
  } finally {
    await pool.end()
  }
}
