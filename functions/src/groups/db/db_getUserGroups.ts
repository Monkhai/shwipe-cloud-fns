import { getPool } from '../../pool'
import { PublicUserIdsTable } from '../../publicUserIds/publicUserIdsTypes'
import { UsersTable } from '../../users/userTypes'
import { ClientGroup, GroupMembersTable, GroupsTable } from '../groupTypes'

export async function db_getUserGroups(userId: string): Promise<Array<ClientGroup>> {
  const pool = await getPool()
  try {
    const query = `
      SELECT 
        g.${GroupsTable.ID},
        g.${GroupsTable.NAME},
        array_agg(json_build_object(
          'id', member_public.${PublicUserIdsTable.PUBLIC_ID},
          'display_name', member_user.${UsersTable.DISPLAY_NAME},
          'photo_url', member_user.${UsersTable.PHOTO_URL}
        )) as members
      FROM ${GroupsTable.TABLE_NAME} g
      JOIN ${GroupMembersTable.TABLE_NAME} gm ON g.${GroupsTable.ID} = gm.${GroupMembersTable.GROUP_ID}
      JOIN ${GroupMembersTable.TABLE_NAME} all_members ON g.${GroupsTable.ID} = all_members.${GroupMembersTable.GROUP_ID}
      JOIN ${UsersTable.TABLE_NAME} member_user ON all_members.${GroupMembersTable.USER_ID} = member_user.${UsersTable.ID}
      JOIN ${PublicUserIdsTable.TABLE_NAME} member_public ON member_user.${UsersTable.ID} = member_public.${PublicUserIdsTable.ID}
      WHERE gm.${GroupMembersTable.USER_ID} = $1
      GROUP BY g.${GroupsTable.ID}, g.${GroupsTable.NAME}
    `
    const result = await pool.query(query, [userId])
    return result.rows.map(row => ({
      id: row[GroupsTable.ID],
      name: row[GroupsTable.NAME],
      members: row.members.map((member: any) => ({
        id: member.id,
        display_name: member[UsersTable.DISPLAY_NAME],
        photo_url: member[UsersTable.PHOTO_URL],
      })),
    }))
  } finally {
    await pool.end()
  }
}
