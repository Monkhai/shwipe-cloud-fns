import { error } from 'firebase-functions/logger'
import { auth } from 'firebase-functions/v1'
import { logger } from '../logger'
import { db_insertUser } from './db/db_insertUser'

export const onUserCreateFn = auth.user().onCreate(async user => {
  try {
    if (!user.displayName) {
      logger.logError('User must have a display name')
      throw new Error('User must have a display name')
    }
    if (!user.photoURL) {
      logger.logError('User must have a photo URL')
      throw new Error('User must have a photo URL')
    }

    await db_insertUser(user)
    logger.logSuccess(`User created: ${user.displayName}`)
  } catch (err) {
    logger.logError(`Error creating user: ${err}`)
    error(err)
    throw err
  }
})
