import { SafeUser } from '../users/userTypes'

export enum GroupsTable {
  TABLE_NAME = 'groups',
  ID = 'id',
  NAME = 'name',
}

export type Group = {
  id: string
  name: string
}

export type ClientGroup = Group & {
  members: SafeUser[]
}
