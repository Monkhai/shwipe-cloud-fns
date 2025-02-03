import { getPool } from '../../pool'
import { UsersTable } from '../userTypes'

export async function db_getUserPushToken(userId: string): Promise<string | null> {
  const pool = await getPool()
  try {
    const result = await pool.query(`SELECT ${UsersTable.EXPO_PUSH_TOKEN} FROM ${UsersTable.NAME} WHERE ${UsersTable.ID} = $1`, [userId])
    return result.rows[0][UsersTable.EXPO_PUSH_TOKEN]
  } finally {
    await pool.end()
  }
}
