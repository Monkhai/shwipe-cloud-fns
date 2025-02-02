import { UserRecord } from 'firebase-admin/auth'
import { getPool } from '../../pool'
import { UsersTable } from '../userTypes'

export async function db_insertUser(user: UserRecord) {
  const pool = await getPool()

  const query = `INSERT INTO ${UsersTable.NAME} (${UsersTable.ID}, ${UsersTable.PHOTO_URL}, ${UsersTable.DISPLAY_NAME}) VALUES ($1, $2, $3)`
  await pool.query(query, [user.uid, user.photoURL, user.displayName])
}
