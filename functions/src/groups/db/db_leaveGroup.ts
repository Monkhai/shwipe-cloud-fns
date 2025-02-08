import { GroupMembersTable } from '../../groupMembers/groupMembersTypes'
import { getPool } from '../../pool'

export async function db_leaveGroup(groupId: string, userId: string) {
  const pool = await getPool()

  try {
    const query = `--sql
    DELETE FROM ${GroupMembersTable.TABLE_NAME}
    WHERE ${GroupMembersTable.GROUP_ID} = $1
    AND ${GroupMembersTable.USER_ID} = $2
    `
    await pool.query(query, [groupId, userId])
  } finally {
    await pool.end()
  }
}
