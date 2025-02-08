import { Group } from '../groups/groupTypes'
import { User } from '../users/userTypes'

export enum GroupInvitationsTable {
  TABLE_NAME = 'group_invitations',
  ID = 'id',
  GROUP_ID = 'group_id',
  SENDER_ID = 'sender_id',
  RECEIVER_ID = 'receiver_id',
  STATUS = 'status',
  PUBLIC_USER_ID = 'PUBLIC_USER_ID',
}

export enum GroupInvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

export type GroupInvitation = {
  id: string
  group_id: string
  sender_id: string
  receiver_id: string
  status: GroupInvitationStatus
}

export enum GroupInvitationResult {
  INVITATION_ID = 'invitation_id',
  GROUP_ID = 'group_id',
  STATUS = 'status',
}

export enum GroupInvitationMemberResult {
  DISPLAY_NAME = 'display_name',
  PHOTO_URL = 'photo_url',
  PUBLIC_ID = 'public_id',
}

export type SafeGroupInvitation = Group & {
  invitation_id: string
  status: GroupInvitationStatus
  members: Array<Omit<User, 'id' | 'expo_push_token'>>
}
