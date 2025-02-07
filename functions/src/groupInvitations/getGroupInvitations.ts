import { HttpsError, onCall } from 'firebase-functions/https'
import { logger } from '../logger'
import { SafeGroupInvitation } from './groupInvitationTypes'
import { error } from 'firebase-functions/logger'
import { db_getGroupInvitations } from './db/db_getGroupInvitations'

type GetGroupInvitationsResonponse = {
  groupInvitations: Array<SafeGroupInvitation>
}

export const getGroupInvitationsFn = onCall<null, Promise<GetGroupInvitationsResonponse>>(async request => {
  try {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User not authenticated')
    }
    const groupInvitations = await db_getGroupInvitations(request.auth.uid)
    return { groupInvitations }
  } catch (err) {
    const errorMessage = `Error getting group invitations: ${err}`
    logger.logError(errorMessage)
    error(err)
    throw err
  }
})
