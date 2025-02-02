import { TelegramLogger } from '@monkhai/telelogger'
import { auth } from 'firebase-functions/v1'
import { db_insertUser } from './db/db_insertUser'

export const onUserCreateFn = auth.user().onCreate(async user => {
  const logger = new TelegramLogger({
    chatId: 7306112728,
    botToken: '7846207362:AAHSZQTu4KOJ_NUl-9FlwaGBYZCgoM_kc1I',
  })
  if (!user.displayName) {
    logger.logError('User must have a display name')
    throw new Error('User must have a display name')
  }
  if (!user.photoURL) {
    logger.logError('User must have a photo URL')
    throw new Error('User must have a photo URL')
  }

  try {
    await db_insertUser(user)
    logger.logSuccess(`User created: ${user.displayName}`)
  } catch (err) {
    logger.logError(`Error creating user: ${err}`)
    throw err
  }
})
