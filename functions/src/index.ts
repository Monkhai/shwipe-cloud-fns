import * as admin from 'firebase-admin'
import { closePool } from './pool'
import { onUserCreateFn } from './users/onUserCreate'
import { getAllUsersFn } from './users/getAllUsers'
import { sendFriendRequestFn } from './friendRequests/sendFriendRequest'
import { getReceivedFriendRequestsFn } from './friendRequests/getReceivedFriendRequests'
import { getSentFriendRequestsFn } from './friendRequests/getSentFriendRequests'
import { updateFriendRequestFn } from './friendRequests/updateFriendRequest'
import { getUserFriendshipsFn } from './friends/getUserFriendships'

admin.initializeApp()

// Users
export const onUserCreate = onUserCreateFn
export const getAllUsers = getAllUsersFn

// Friend Requests
export const sendFriendRequest = sendFriendRequestFn
export const getSentFriendRequests = getSentFriendRequestsFn
export const getReceivedFriendRequests = getReceivedFriendRequestsFn

// Friendships
export const updateFriendRequest = updateFriendRequestFn

// Friends
export const getUserFriendships = getUserFriendshipsFn

// Cleanup when the function instance is shut down
process.on('SIGTERM', async () => {
  await closePool()
})
