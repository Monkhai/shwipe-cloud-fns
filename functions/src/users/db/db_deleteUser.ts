import { getPool } from '../../pool'
import { UsersTable } from '../userTypes'

export async function db_deleteUser(userId: string): Promise<void> {
  const pool = await getPool()
  try {
    const query = `DELETE FROM ${UsersTable.NAME} WHERE ${UsersTable.ID} = $1`
    await pool.query(query, [userId])
  } finally {
    await pool.end()
  }
}
