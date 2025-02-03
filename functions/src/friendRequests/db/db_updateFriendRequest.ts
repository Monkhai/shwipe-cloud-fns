import { HttpsError } from 'firebase-functions/https'
import { FriendsTable } from '../../friends/friendsTypes'
import { getPool } from '../../pool'
import { FriendRequestsStatus, FriendRequestsTable } from '../friendRequestTypes'
import { warn } from 'firebase-functions/logger'
import { logger } from '../../logger'

export async function db_updateFriendRequest(userId: string, friendRequestId: string, status: FriendRequestsStatus) {
  switch (status) {
    case FriendRequestsStatus.ACCEPTED: {
      await handleAcepted(userId, friendRequestId)
      break
    }
    case FriendRequestsStatus.CANCELLED: {
      await handleCancelled(userId, friendRequestId)
      break
    }
    case FriendRequestsStatus.REJECTED: {
      await handleReject(userId, friendRequestId)
      break
    }
    case FriendRequestsStatus.PENDING: {
      logger.logWarn(`${userId} tried to update a friend request with a pending status!`)
      warn(`${userId} tried to update a friend request with a pending status!`)
      break
    }
    default: {
      const errorMessage = `Invalid friend request status: ${status} for user ${userId}`
      throw new HttpsError('invalid-argument', errorMessage)
    }
  }
}

async function handleAcepted(userId: string, friendRequestId: string) {
  const pool = await getPool()
  const client = await pool.connect()
  client.query('BEGIN')

  try {
    const verifyQuery = `--sql
    SELECT ${FriendRequestsTable.RECEIVER_ID}, ${FriendRequestsTable.SENDER_ID}
     FROM ${FriendRequestsTable.NAME}
      WHERE ${FriendRequestsTable.ID} = $1`

    const verifyResult = await client.query(verifyQuery, [friendRequestId])
    if (verifyResult.rows.length === 0) {
      const errorMessage = `Friend request ${friendRequestId} not found`
      throw new HttpsError('not-found', errorMessage)
    }

    // ensure only receiver sent this message
    const receiverId = verifyResult.rows[0][FriendRequestsTable.RECEIVER_ID]
    if (receiverId !== userId) {
      const errorMessage = `User ${userId} not allowed to update friend request ${verifyResult.rows}`
      throw new HttpsError('permission-denied', errorMessage)
    }

    const senderId = verifyResult.rows[0][FriendRequestsTable.SENDER_ID]
    const updateQuery = `--sql
    UPDATE ${FriendRequestsTable.NAME}
      SET ${FriendRequestsTable.STATUS} = $1::friend_request_status
      WHERE ${FriendRequestsTable.ID} = $2`

    await client.query(updateQuery, [FriendRequestsStatus.ACCEPTED, friendRequestId])

    const friendshipQuery = `--sql
    INSERT INTO ${FriendsTable.NAME} (${FriendsTable.USER_1_ID}, ${FriendsTable.USER_2_ID}) VALUES ($1, $2)`
    await client.query(friendshipQuery, [receiverId, senderId])

    await client.query('COMMIT')
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
    pool.end()
  }
}

async function handleCancelled(userId: string, friendRequestId: string) {
  const pool = await getPool()
  const client = await pool.connect()
  client.query('BEGIN')

  try {
    const verifyQuery = `--sql
    SELECT ${FriendRequestsTable.SENDER_ID}
     FROM ${FriendRequestsTable.NAME}
      WHERE ${FriendRequestsTable.ID} = $1`

    const verifyResult = await client.query(verifyQuery, [friendRequestId])
    if (verifyResult.rows.length === 0) {
      const errorMessage = `Friend request ${friendRequestId} not found`
      throw new HttpsError('not-found', errorMessage)
    }

    // ensure only receiver sent this message
    const senderId = verifyResult.rows[0][FriendRequestsTable.SENDER_ID]
    if (senderId !== userId) {
      const errorMessage = `User ${userId} not allowed to update friend request ${verifyResult.rows}`
      throw new HttpsError('permission-denied', errorMessage)
    }

    // delete friend request
    const deleteQuery = `--sql
    DELETE FROM ${FriendRequestsTable.NAME}
      WHERE ${FriendRequestsTable.ID} = $1`

    await client.query(deleteQuery, [friendRequestId])

    await client.query('COMMIT')
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
    pool.end()
  }
}

async function handleReject(userId: string, friendRequestId: string) {
  const pool = await getPool()
  const client = await pool.connect()
  client.query('BEGIN')
  try {
    const verifyQuery = `--sql
    SELECT ${FriendRequestsTable.RECEIVER_ID}
     FROM ${FriendRequestsTable.NAME}
      WHERE ${FriendRequestsTable.ID} = $1`

    const verifyResult = await client.query(verifyQuery, [friendRequestId])
    if (verifyResult.rows.length === 0) {
      const errorMessage = `Friend request ${friendRequestId} not found`
      throw new HttpsError('not-found', errorMessage)
    }

    const receiverId = verifyResult.rows[0][FriendRequestsTable.RECEIVER_ID]
    if (receiverId !== userId) {
      const data = verifyResult.rows.map(row => row[FriendRequestsTable.SENDER_ID])
      const errorMessage = `User ${userId} not allowed to update friend request ${JSON.stringify(data)}`
      throw new HttpsError('permission-denied', errorMessage)
    }

    const deleteQuery = `--sql
    DELETE FROM ${FriendRequestsTable.NAME}
      WHERE ${FriendRequestsTable.ID} = $1`

    await client.query(deleteQuery, [friendRequestId])

    await client.query('COMMIT')
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
    pool.end()
  }
}
