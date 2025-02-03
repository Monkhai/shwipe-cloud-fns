import { getPool } from '../../pool'
import { FriendsTable } from '../friendsTypes'

export async function db_insertFriendship(user1Id: string, user2Id: string): Promise<void> {
  const pool = await getPool()

  try {
    const query = `INSERT INTO ${FriendsTable.NAME} (${FriendsTable.USER_1_ID}, ${FriendsTable.USER_2_ID}) VALUES ($1, $2)`
    await pool.query(query, [user1Id, user2Id])
  } finally {
    await pool.end()
  }
}
