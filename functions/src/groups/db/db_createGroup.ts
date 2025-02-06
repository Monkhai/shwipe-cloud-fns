import { v4 } from 'uuid'
import { getPool } from '../../pool'
import { GroupsTable, GroupMembersTable } from '../groupTypes'

export async function db_createGroup(userId: string, groupName: string) {
  const pool = await getPool()
  const client = await pool.connect()
  try {
    const groupId = v4()
    client.query('BEGIN')
    const groupTableQuery = `INSERT INTO ${GroupsTable.TABLE_NAME} (${GroupsTable.ID}, ${GroupsTable.NAME}) VALUES ($1, $2)`
    await pool.query(groupTableQuery, [groupId, groupName])
    const groupMembersTableQuery = `INSERT INTO ${GroupMembersTable.TABLE_NAME} (${GroupMembersTable.GROUP_ID}, ${GroupMembersTable.USER_ID}) VALUES ($1, $2)`
    await pool.query(groupMembersTableQuery, [groupId, userId])
    client.query('COMMIT')
  } finally {
    await pool.end()
  }
}
