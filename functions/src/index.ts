import * as admin from 'firebase-admin'
import { getReceivedFriendRequestsFn } from './friendRequests/getReceivedFriendRequests'
import { getSentFriendRequestsFn } from './friendRequests/getSentFriendRequests'
import { sendFriendRequestFn } from './friendRequests/sendFriendRequest'
import { updateFriendRequestFn } from './friendRequests/updateFriendRequest'
import { getUserFriendshipsFn } from './friends/getUserFriendships'
import { onUserDeleteFn } from './users/db/onUserDelete'
import { getAllUsersFn } from './users/getAllUsers'
import { onUserCreateFn } from './users/onUserCreate'
import { updateUserPushTokenFn } from './users/updateUserPushToken'
import { sendSessionInvitationFn } from './sessions/sendSessionInvitation'
import { insertGroupFn } from './groups/insertGroup'
import { getUserGroupsFn } from './groups/getUserGroups'
import { insertGroupMemberFn } from './groupMembers/insertGroupMember'
import { sendGroupInvitationFn } from './groups/sendGroupInvitation'

admin.initializeApp()

// Users
export const onUserCreate = onUserCreateFn
export const getAllUsers = getAllUsersFn
export const onUserDelete = onUserDeleteFn
export const updateUserPushToken = updateUserPushTokenFn

// Friend Requests
export const sendFriendRequest = sendFriendRequestFn
export const getSentFriendRequests = getSentFriendRequestsFn
export const getReceivedFriendRequests = getReceivedFriendRequestsFn

// Friendships
export const updateFriendRequest = updateFriendRequestFn

// Friends
export const getUserFriendships = getUserFriendshipsFn

// Sessions
export const sendSessionInvitation = sendSessionInvitationFn

// Groups
export const insertGroup = insertGroupFn
export const getUserGroups = getUserGroupsFn
export const sendGroupInvitation = sendGroupInvitationFn

// Group Members
export const insertGroupMember = insertGroupMemberFn
