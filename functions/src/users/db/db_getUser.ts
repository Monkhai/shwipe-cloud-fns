import { getPool } from '../../pool'
import { UsersTable } from '../userTypes'

export async function db_getUser(userId: string) {
  const pool = await getPool()
  try {
    const result = await pool.query(`SELECT * FROM ${UsersTable.NAME} WHERE ${UsersTable.ID} = $1`, [userId])
    return result.rows[0]
  } finally {
    await pool.end()
  }
}
