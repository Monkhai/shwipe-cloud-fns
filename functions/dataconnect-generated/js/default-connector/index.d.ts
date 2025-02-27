import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export interface AdminCreateUserData {
  user_insert: User_Key;
}

export interface AdminCreateUserVariables {
  id: string;
  displayName: string;
  photoURL: string;
}

export interface AdminGetUserData {
  user?: {
    id: string;
    displayName: string;
    photoURL: string;
  } & User_Key;
}

export interface AdminGetUserVariables {
  id: string;
}

export interface Friend_Key {
  user1Id: string;
  user2Id: string;
  __typename?: 'Friend_Key';
}

export interface User_Key {
  id: string;
  __typename?: 'User_Key';
}


/* Allow users to create refs without passing in DataConnect */
export function adminCreateUserRef(vars: AdminCreateUserVariables): (MutationRef<AdminCreateUserData, AdminCreateUserVariables> & { __angular?: false });
/* Allow users to pass in custom DataConnect instances */
export function adminCreateUserRef(dc: DataConnect, vars: AdminCreateUserVariables): (MutationRef<AdminCreateUserData, AdminCreateUserVariables> & { __angular?: false });

export function adminCreateUser(vars: AdminCreateUserVariables): MutationPromise<AdminCreateUserData, AdminCreateUserVariables>;
export function adminCreateUser(dc: DataConnect, vars: AdminCreateUserVariables): MutationPromise<AdminCreateUserData, AdminCreateUserVariables>;


/* Allow users to create refs without passing in DataConnect */
export function adminGetUserRef(vars: AdminGetUserVariables): (QueryRef<AdminGetUserData, AdminGetUserVariables> & { __angular?: false });
/* Allow users to pass in custom DataConnect instances */
export function adminGetUserRef(dc: DataConnect, vars: AdminGetUserVariables): (QueryRef<AdminGetUserData, AdminGetUserVariables> & { __angular?: false });

export function adminGetUser(vars: AdminGetUserVariables): QueryPromise<AdminGetUserData, AdminGetUserVariables>;
export function adminGetUser(dc: DataConnect, vars: AdminGetUserVariables): QueryPromise<AdminGetUserData, AdminGetUserVariables>;

