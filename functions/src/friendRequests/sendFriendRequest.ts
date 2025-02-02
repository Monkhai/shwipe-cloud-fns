import { TelegramLogger } from '@monkhai/telelogger'
import { HttpsError, onCall } from 'firebase-functions/https'
import { db_insertFriendRequest } from './db/db_insertFriendRequest'

type SendFriendRequestRequest = {
  userId: string
}

export const sendFriendRequestFn = onCall<SendFriendRequestRequest, Promise<void>>(async request => {
  const logger = new TelegramLogger({
    chatId: 7306112728,
    botToken: '7846207362:AAHSZQTu4KOJ_NUl-9FlwaGBYZCgoM_kc1I',
  })
  if (!request.auth) {
    logger.logError('User not authenticated')
    throw new HttpsError('unauthenticated', 'User not authenticated')
  }

  try {
    await db_insertFriendRequest(request.auth.uid, request.data.userId)
    logger.logInfo(`Friend request sent to ${request.data.userId}`)
  } catch (err) {
    const errorMessage = `Error sending friend request: ${err}`
    logger.logError(errorMessage)
    throw new HttpsError('internal', errorMessage)
  }
})
