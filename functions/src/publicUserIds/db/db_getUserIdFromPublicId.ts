import { getPool } from '../../pool'
import { PublicUserIdsTable } from '../publicUserIdsTypes'

export async function db_getUserIdFromPublicId(publicId: string): Promise<string> {
  const pool = await getPool()
  try {
    const query = `
    SELECT ${PublicUserIdsTable.ID} FROM ${PublicUserIdsTable.NAME} WHERE ${PublicUserIdsTable.PUBLIC_ID} = $1
  `
    const result = await pool.query(query, [publicId])
    return result.rows[0].id
  } finally {
    await pool.end()
  }
}
