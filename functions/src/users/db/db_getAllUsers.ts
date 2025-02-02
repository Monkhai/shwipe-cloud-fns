import { getPool } from '../../pool'
import { SafeUser, UsersTable } from '../userTypes'

export async function db_getAllUsers(userId: string): Promise<SafeUser[]> {
  const pool = await getPool()
  const query = `SELECT ${UsersTable.DISPLAY_NAME}, ${UsersTable.PHOTO_URL} FROM ${UsersTable.NAME}
    WHERE ${UsersTable.ID} != $1
  `
  const result = await pool.query(query, [userId])
  return result.rows.map(row => ({
    display_name: row[UsersTable.DISPLAY_NAME],
    photo_url: row[UsersTable.PHOTO_URL],
  }))
}
