import { v4 } from 'uuid'
import { getPool } from '../../pool'
import { PublicUserIdsTable } from '../publicUserIdsTypes'

export async function db_insertPublicUserId(userId: string) {
  const pool = await getPool()
  try {
    const publicId = v4()
    const query = `INSERT INTO ${PublicUserIdsTable.NAME} (${PublicUserIdsTable.ID}, ${PublicUserIdsTable.PUBLIC_ID}) VALUES ($1, $2)`
    await pool.query(query, [userId, publicId])
  } finally {
    pool.end()
  }
}
