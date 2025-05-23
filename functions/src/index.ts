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
import { sendGroupInvitationFn } from './groupInvitations/sendGroupInvitation'
import { getGroupInvitationsFn } from './groupInvitations/getGroupInvitations'
import { leaveGroupFn } from './groups/leaveGroup'
import { cancelGroupInvitationFn } from './groupInvitations/cancelGRoupInvitation'
import { updateGroupInvitationFn } from './groupInvitations/updateGroupInvitation'
import { deleteAccountFn } from './users/deleteAccount'
import { getPopularRestaurantsFn } from './restaurants/getPopularRestaurants'
import { getRestaurantDetailsFn } from './restaurants/getRestaurantDetails'
import { getPublicIdFn } from './users/getPublicId'
import { getUserFn } from './users/getUser'
import { removeFriendshipFn } from './friends/removeFriendship'

admin.initializeApp()
// Users
export const onUserCreate = onUserCreateFn
export const getAllUsers = getAllUsersFn
export const getPublicId = getPublicIdFn
export const onUserDelete = onUserDeleteFn
export const updateUserPushToken = updateUserPushTokenFn
export const deleteAccount = deleteAccountFn
export const getUser = getUserFn

// Friend Requests
export const sendFriendRequest = sendFriendRequestFn
export const getSentFriendRequests = getSentFriendRequestsFn
export const getReceivedFriendRequests = getReceivedFriendRequestsFn

// Friends
export const getUserFriendships = getUserFriendshipsFn
export const updateFriendRequest = updateFriendRequestFn
export const removeFriendship = removeFriendshipFn

// Sessions
export const sendSessionInvitation = sendSessionInvitationFn

// Groups
export const getUserGroups = getUserGroupsFn
export const insertGroup = insertGroupFn
export const sendGroupInvitation = sendGroupInvitationFn
export const leaveGroup = leaveGroupFn

// Group Members
export const insertGroupMember = insertGroupMemberFn

// Group Invitations
export const getGroupInvitations = getGroupInvitationsFn
export const cancelGroupInvitation = cancelGroupInvitationFn
export const updateGroupInvitation = updateGroupInvitationFn

// Restaurants
export const getPopularRestaurants = getPopularRestaurantsFn
export const getRestaurantDetails = getRestaurantDetailsFn
