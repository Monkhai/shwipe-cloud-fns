import { getPool } from '../../pool'
import { GroupMembersTable } from '../groupMembersTypes'

export async function db_insertGroupUser(groupId: string, userId: string) {
  const pool = await getPool()
  try {
    const query = `
      INSERT INTO ${GroupMembersTable.TABLE_NAME} (
        ${GroupMembersTable.GROUP_ID},
        ${GroupMembersTable.USER_ID}
      ) VALUES ($1, $2)
    `
    await pool.query(query, [groupId, userId])
  } finally {
    await pool.end()
  }
}
