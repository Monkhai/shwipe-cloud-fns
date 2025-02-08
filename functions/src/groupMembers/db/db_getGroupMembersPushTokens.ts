import { getPool } from '../../pool'
import { UsersTable } from '../../users/userTypes'
import { GroupMembersTable } from '../groupMembersTypes'

export async function db_getGroupMembersPushToken(groupId: string): Promise<Array<string>> {
  const pool = await getPool()
  try {
    const query = `--sql
    SELECT u.${UsersTable.EXPO_PUSH_TOKEN}
    FROM ${GroupMembersTable.TABLE_NAME} gm
    JOIN ${UsersTable.TABLE_NAME} u ON gm.${GroupMembersTable.USER_ID} = u.${UsersTable.ID}
    WHERE gm.${GroupMembersTable.GROUP_ID} = $1
    `
    const result = await pool.query(query, [groupId])
    return result.rows.map(row => row[UsersTable.EXPO_PUSH_TOKEN])
  } finally {
    await pool.end()
  }
}
