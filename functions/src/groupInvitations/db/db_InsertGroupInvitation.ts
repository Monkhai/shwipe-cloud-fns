import { getPool } from '../../pool'
import { PublicUserIdsTable } from '../../publicUserIds/publicUserIdsTypes'
import { GroupInvitationsTable } from '../groupInvitationTypes'

export async function db_insertGroupInvitation(groupId: string, senderId: string, receiverPublicId: string) {
  const pool = await getPool()

  try {
    const query = `--sql
    WITH receiver AS (
      SELECT pui.${PublicUserIdsTable.ID} as receiver_id
      FROM ${PublicUserIdsTable.TABLE_NAME} pui
      WHERE pui.${PublicUserIdsTable.PUBLIC_ID} = $3
    ),
    INSERT INTO ${GroupInvitationsTable.TABLE_NAME}
      (${GroupInvitationsTable.GROUP_ID}, ${GroupInvitationsTable.SENDER_ID}, ${GroupInvitationsTable.RECEIVER_ID})
      VALUES ($1, $2, (SELECT receiver_id FROM receiver))
    `

    await pool.query(query, [groupId, senderId, receiverPublicId])
  } finally {
    await pool.end()
  }
}
