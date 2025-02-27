import { GroupInvitationsTable } from '../../groupInvitations/groupInvitationTypes'
import { GroupMembersTable } from '../../groupMembers/groupMembersTypes'
import { getPool } from '../../pool'
import { PublicUserIdsTable } from '../../publicUserIds/publicUserIdsTypes'
import { SafeUser, UsersTable } from '../../users/userTypes'
import { ClientGroup, GroupsTable } from '../groupTypes'

export async function db_getUserGroups(userId: string): Promise<Array<ClientGroup>> {
  const pool = await getPool()
  try {
    const query = `--sql
      SELECT 
        g.${GroupsTable.ID},
        g.${GroupsTable.NAME},
        COALESCE(
          (
            SELECT array_agg(json_build_object(
              'id', mp.${PublicUserIdsTable.PUBLIC_ID},
              'display_name', mu.${UsersTable.DISPLAY_NAME},
              'photo_url', mu.${UsersTable.PHOTO_URL}
            ))
            FROM (
              SELECT DISTINCT ON (member_user.${UsersTable.ID})
                member_user.${UsersTable.ID},
                member_user.${UsersTable.DISPLAY_NAME},
                member_user.${UsersTable.PHOTO_URL},
                member_public.${PublicUserIdsTable.PUBLIC_ID}
              FROM ${GroupMembersTable.TABLE_NAME} all_members
              JOIN ${UsersTable.TABLE_NAME} member_user ON all_members.${GroupMembersTable.USER_ID} = member_user.${UsersTable.ID}
              JOIN ${PublicUserIdsTable.TABLE_NAME} member_public ON member_user.${UsersTable.ID} = member_public.${PublicUserIdsTable.ID}
              WHERE all_members.${GroupMembersTable.GROUP_ID} = g.${GroupsTable.ID}
              AND all_members.${GroupMembersTable.USER_ID} != $1
            ) mu
            JOIN ${PublicUserIdsTable.TABLE_NAME} mp ON mu.${UsersTable.ID} = mp.${PublicUserIdsTable.ID}
          ),
          ARRAY[]::json[]
        ) as members,
        COALESCE(
          (
            SELECT array_agg(json_build_object(
              'id', rp.${PublicUserIdsTable.PUBLIC_ID},
              'display_name', ru.${UsersTable.DISPLAY_NAME},
              'photo_url', ru.${UsersTable.PHOTO_URL}
            ))
            FROM (
              SELECT DISTINCT ON (receiver_user.${UsersTable.ID})
                receiver_user.${UsersTable.ID},
                receiver_user.${UsersTable.DISPLAY_NAME},
                receiver_user.${UsersTable.PHOTO_URL}
              FROM ${GroupInvitationsTable.TABLE_NAME} gi
              JOIN ${UsersTable.TABLE_NAME} receiver_user ON gi.${GroupInvitationsTable.RECEIVER_ID} = receiver_user.${UsersTable.ID}
              WHERE gi.${GroupInvitationsTable.GROUP_ID} = g.${GroupsTable.ID}
              AND gi.${GroupInvitationsTable.STATUS} = 'pending'
            ) ru
            JOIN ${PublicUserIdsTable.TABLE_NAME} rp ON ru.${UsersTable.ID} = rp.${PublicUserIdsTable.ID}
          ),
          ARRAY[]::json[]
        ) as pending_members
      FROM ${GroupsTable.TABLE_NAME} g
      JOIN ${GroupMembersTable.TABLE_NAME} gm ON g.${GroupsTable.ID} = gm.${GroupMembersTable.GROUP_ID}
      WHERE gm.${GroupMembersTable.USER_ID} = $1
      GROUP BY g.${GroupsTable.ID}, g.${GroupsTable.NAME}
    `
    const result = await pool.query(query, [userId])
    return result.rows.map(row => {
      const members: SafeUser[] = row.members.map((member: any) => ({
        id: member.id,
        display_name: member[UsersTable.DISPLAY_NAME],
        photo_url: member[UsersTable.PHOTO_URL],
      }))
      const pendingMembers: SafeUser[] = row.pending_members.map((pendingMember: any) => ({
        id: pendingMember.id,
        display_name: pendingMember[UsersTable.DISPLAY_NAME],
        photo_url: pendingMember[UsersTable.PHOTO_URL],
      }))

      const group: ClientGroup = {
        id: row[GroupsTable.ID],
        name: row[GroupsTable.NAME],
        members,
        pendingMembers,
      }
      return group
    })
  } finally {
    await pool.end()
  }
}
