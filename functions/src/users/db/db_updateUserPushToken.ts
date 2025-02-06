import { getPool } from '../../pool'
import { UsersTable } from '../userTypes'

export async function db_updateUserPushToken(userId: string, pushToken: string) {
  const pool = await getPool()

  try {
    const query = `UPDATE ${UsersTable.TABLE_NAME} SET ${UsersTable.EXPO_PUSH_TOKEN} = $1 WHERE ${UsersTable.ID} = $2`
    await pool.query(query, [pushToken, userId])
  } finally {
    await pool.end()
  }
}
