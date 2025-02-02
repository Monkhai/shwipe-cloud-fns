import { auth } from 'firebase-functions/v1'
import { db_deleteUser } from './db_deleteUser'
import { error } from 'firebase-functions/logger'
import { logger } from '../../logger'

export const onUserDeleteFn = auth.user().onDelete(async user => {
  try {
    await db_deleteUser(user.uid)
  } catch (err) {
    const errMsg = `Error deleting user ${user.uid} from database: ${err}`
    logger.logError(errMsg)
    error(err)
    throw err
  }
})
