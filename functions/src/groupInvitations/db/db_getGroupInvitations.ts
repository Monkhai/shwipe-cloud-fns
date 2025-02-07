import { getPool } from '../../pool'
import { GroupInvitationMemberResult, GroupInvitationResult, GroupInvitationsTable, SafeGroupInvitation } from '../groupInvitationTypes'
import { GroupsTable } from '../../groups/groupTypes'
import { UsersTable } from '../../users/userTypes'
import { GroupMembersTable } from '../../groupMembers/groupMembersTypes'
import { PublicUserIdsTable } from '../../publicUserIds/publicUserIdsTypes'

export async function db_getGroupInvitations(userId: string): Promise<Array<SafeGroupInvitation>> {
  const pool = await getPool()

  try {
    const query = `--sql
    WITH group_members AS (
      SELECT 
        gm.${GroupMembersTable.GROUP_ID},
        json_agg(
          json_build_object(
            'display_name', mu.${UsersTable.DISPLAY_NAME},
            'photo_url', mu.${UsersTable.PHOTO_URL},
            'public_id', pui.${PublicUserIdsTable.PUBLIC_ID}
          )
        ) as members
      FROM ${GroupMembersTable.TABLE_NAME} gm
      JOIN ${UsersTable.TABLE_NAME} mu ON gm.${GroupMembersTable.USER_ID} = mu.${UsersTable.ID}
      JOIN ${PublicUserIdsTable.TABLE_NAME} pui ON mu.${UsersTable.ID} = pui.${PublicUserIdsTable.ID}
      GROUP BY gm.${GroupMembersTable.GROUP_ID}
    )
    SELECT 
      g.${GroupsTable.ID} as id,
      gi.${GroupInvitationsTable.ID} as invitation_id,
      gi.${GroupInvitationsTable.STATUS} as status,
      g.${GroupsTable.NAME} as name,
      u.${UsersTable.DISPLAY_NAME} as display_name,
      u.${UsersTable.PHOTO_URL} as photo_url,
      COALESCE(gm.members, '[]'::json) as members
    FROM ${GroupInvitationsTable.TABLE_NAME} gi
    JOIN ${GroupsTable.TABLE_NAME} g ON gi.${GroupInvitationsTable.GROUP_ID} = g.${GroupsTable.ID}
    JOIN ${UsersTable.TABLE_NAME} u ON gi.${GroupInvitationsTable.SENDER_ID} = u.${UsersTable.ID}
    LEFT JOIN group_members gm ON g.${GroupsTable.ID} = gm.${GroupMembersTable.GROUP_ID}
    WHERE gi.${GroupInvitationsTable.RECEIVER_ID} = $1`

    const result = await pool.query(query, [userId])
    return result.rows.map(row => ({
      id: row[GroupsTable.ID],
      invitation_id: row[GroupInvitationResult.INVITATION_ID],
      status: row[GroupInvitationResult.STATUS],
      name: row[GroupsTable.NAME],
      members: row.members.map((member: any) => ({
        display_name: member[GroupInvitationMemberResult.DISPLAY_NAME],
        photo_url: member[GroupInvitationMemberResult.PHOTO_URL],
        public_id: member[GroupInvitationMemberResult.PUBLIC_ID],
      })),
    }))
  } finally {
    await pool.end()
  }
}
