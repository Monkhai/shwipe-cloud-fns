import { HttpsError } from 'firebase-functions/https'
import { getPool } from '../../pool'
import { GroupInvitationsTable, GroupInvitationStatus } from '../groupInvitationTypes'
import { Pool } from 'pg'
import { logger } from '../../logger'
import { warn } from 'firebase-functions/logger'
import { GroupMembersTable } from '../../groupMembers/groupMembersTypes'

export async function db_updateGroupInvitation(groupId: string, userId: string, status: GroupInvitationStatus) {
  const pool = await getPool()
  try {
    switch (status) {
      case GroupInvitationStatus.ACCEPTED: {
        await handleAccepted(groupId, userId, status, pool)
        break
      }
      case GroupInvitationStatus.REJECTED: {
        await handleRejected(groupId, userId, pool)
        break
      }
      case GroupInvitationStatus.CANCELLED: {
        logger.logWarn(`${userId} tried to update a group invitation with a cancelled status! We have a dedicated function for this!`)
        break
      }
      case GroupInvitationStatus.PENDING: {
        logger.logWarn(`${userId} tried to update a friend request with a pending status!`)
        warn(`${userId} tried to update a friend request with a pending status!`)
        break
      }
      default: {
        throw new HttpsError('invalid-argument', 'Invalid group invitation status')
      }
    }
  } finally {
    await pool.end()
  }
}

async function handleAccepted(groupId: string, userId: string, status: GroupInvitationStatus, pool: Pool) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const groupInvitationQuery = `--sql
    UPDATE ${GroupInvitationsTable.TABLE_NAME}
    SET ${GroupInvitationsTable.STATUS} = $3::request_status
    WHERE ${GroupInvitationsTable.GROUP_ID} = $1 
    AND ${GroupInvitationsTable.RECEIVER_ID} = $2
    AND EXISTS (
      SELECT 1
      FROM ${GroupInvitationsTable.TABLE_NAME}
      WHERE ${GroupInvitationsTable.GROUP_ID} = $1 
      AND ${GroupInvitationsTable.RECEIVER_ID} = $2
    )`
    await client.query(groupInvitationQuery, [groupId, userId, status])

    const groupMembersQuery = `--sql
    INSERT INTO ${GroupMembersTable.TABLE_NAME} (${GroupMembersTable.GROUP_ID}, ${GroupMembersTable.USER_ID})
    SELECT $1, $2
    WHERE EXISTS (
      SELECT 1
      FROM ${GroupInvitationsTable.TABLE_NAME}
      WHERE ${GroupInvitationsTable.GROUP_ID} = $1 
      AND ${GroupInvitationsTable.RECEIVER_ID} = $2
    )`
    await client.query(groupMembersQuery, [groupId, userId])

    await client.query('COMMIT')
  } finally {
    client.release()
  }
}

async function handleRejected(groupId: string, userId: string, pool: Pool) {
  const query = `--sql
    DELETE FROM ${GroupInvitationsTable.TABLE_NAME}
    WHERE ${GroupInvitationsTable.GROUP_ID} = $1 
    AND EXISTS (
      SELECT 1
      FROM ${GroupInvitationsTable.TABLE_NAME}
      WHERE ${GroupInvitationsTable.GROUP_ID} = $1 
      AND ${GroupInvitationsTable.RECEIVER_ID} = $2
    )
  `
  await pool.query(query, [groupId, userId])
}
