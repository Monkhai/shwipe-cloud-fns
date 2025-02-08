import { getPool } from '../../pool'
import { PublicUserIdsTable } from '../../publicUserIds/publicUserIdsTypes'
import { GroupInvitationsTable } from '../groupInvitationTypes'

export async function db_cancelGroupInvitation(groupId: string, publicUserId: string) {
  const pool = await getPool()
  try {
    const query = `--sql
            WITH user_id AS (
              SELECT ${PublicUserIdsTable.ID} as id
              FROM ${PublicUserIdsTable.TABLE_NAME}
              WHERE ${PublicUserIdsTable.PUBLIC_ID} = $2
            )
            DELETE FROM ${GroupInvitationsTable.TABLE_NAME}
            WHERE ${GroupInvitationsTable.GROUP_ID} = $1
            AND ${GroupInvitationsTable.RECEIVER_ID} = (SELECT id FROM user_id)
        `
    await pool.query(query, [groupId, publicUserId])
  } finally {
    await pool.end()
  }
}
