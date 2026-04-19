export type BlogRole = 'Admin' | 'Editor' | 'Author' | 'Viewer';
export type UserStatus = 'Active' | 'Inactive';
export type BlogPermission =
  | 'CreatePost'
  | 'EditPost'
  | 'PublishPost'
  | 'DeletePost'
  | 'ManageUsers'
  | 'ViewAnalytics';

export interface BlogUser {
  id: number;
  name: string;
  email: string;
  githubUsername: string;
  role: BlogRole;
  status: UserStatus;
}

export interface BlogRight {
  id: number;
  role: BlogRole;
  permission: BlogPermission;
  area: string;
  enabled: boolean;
}

