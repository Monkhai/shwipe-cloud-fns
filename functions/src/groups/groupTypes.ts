export enum GroupsTable {
  TABLE_NAME = 'groups',
  ID = 'id',
  NAME = 'name',
}

export enum GroupMembersTable {
  TABLE_NAME = 'group_members',
  GROUP_ID = 'group_id',
  USER_ID = 'user_id',
}

export type Group = {
  id: string
  name: string
}
