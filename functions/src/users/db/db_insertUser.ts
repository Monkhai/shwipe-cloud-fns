import { UserRecord } from 'firebase-admin/auth'
import { v4 as uuidv4 } from 'uuid'
import { getPool } from '../../pool'
import { PublicUserIdsTable } from '../../publicUserIds/publicUserIdsTypes'
import { UsersTable } from '../userTypes'

export async function db_insertUser(user: UserRecord) {
  const pool = await getPool()
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const userQuery = `INSERT INTO ${UsersTable.NAME} (${UsersTable.ID}, ${UsersTable.PHOTO_URL}, ${UsersTable.DISPLAY_NAME}) VALUES ($1, $2, $3)`
    await client.query(userQuery, [user.uid, user.photoURL, user.displayName])

    const publicId = uuidv4()
    const publicUserQuery = `INSERT INTO ${PublicUserIdsTable.NAME} (${PublicUserIdsTable.ID}, ${PublicUserIdsTable.PUBLIC_ID}) VALUES ($1, $2)`
    await client.query(publicUserQuery, [user.uid, publicId])

    await client.query('COMMIT')
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}
