import { Injectable } from '@angular/core';

import { BlogRight, BlogRole, BlogUser } from '../models';

const USERS: BlogUser[] = [
  {
    id: 1,
    name: 'Nguyen Minh Anh',
    email: 'anh.nguyen@dautoeic.test',
    githubUsername: 'minhanh-toeic',
    role: 'Admin',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Tran Bao Long',
    email: 'long.tran@dautoeic.test',
    githubUsername: 'baolong-content',
    role: 'Editor',
    status: 'Active'
  },
  {
    id: 3,
    name: 'Le Thu Ha',
    email: 'ha.le@dautoeic.test',
    githubUsername: 'hathu-grammar',
    role: 'Author',
    status: 'Active'
  },
  {
    id: 4,
    name: 'Pham Duc Khoa',
    email: 'khoa.pham@dautoeic.test',
    githubUsername: 'khoa-review',
    role: 'Viewer',
    status: 'Inactive'
  }
];

const RIGHTS: BlogRight[] = [
  {
    id: 1,
    role: 'Admin',
    permission: 'ManageUsers',
    area: 'Team',
    enabled: true
  },
  {
    id: 2,
    role: 'Editor',
    permission: 'PublishPost',
    area: 'Posts',
    enabled: true
  },
  {
    id: 3,
    role: 'Author',
    permission: 'CreatePost',
    area: 'Posts',
    enabled: true
  },
  {
    id: 4,
    role: 'Viewer',
    permission: 'ViewAnalytics',
    area: 'Analytics',
    enabled: false
  }
];

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly users = [...USERS];
  private readonly rights = [...RIGHTS];

  getUsers(): BlogUser[] {
    return [...this.users];
  }

  getRights(): BlogRight[] {
    return [...this.rights];
  }

  getRoles(): BlogRole[] {
    return ['Admin', 'Editor', 'Author', 'Viewer'];
  }

  addUser(user: Omit<BlogUser, 'id'>): BlogUser {
    const newUser = {
      ...user,
      id: Math.max(...this.users.map(item => item.id)) + 1
    };
    this.users.unshift(newUser);
    return newUser;
  }

  toggleUserStatus(userId: number): BlogUser[] {
    const user = this.users.find(item => item.id === userId);

    if (user) {
      user.status = user.status === 'Active' ? 'Inactive' : 'Active';
    }

    return this.getUsers();
  }

  removeUser(userId: number): BlogUser[] {
    const userIndex = this.users.findIndex(item => item.id === userId);

    if (userIndex >= 0) {
      this.users.splice(userIndex, 1);
    }

    return this.getUsers();
  }

  addRight(right: Omit<BlogRight, 'id'>): BlogRight {
    const newRight = {
      ...right,
      id: Math.max(...this.rights.map(item => item.id)) + 1
    };
    this.rights.unshift(newRight);
    return newRight;
  }

  toggleRight(rightId: number): BlogRight[] {
    const right = this.rights.find(item => item.id === rightId);

    if (right) {
      right.enabled = !right.enabled;
    }

    return this.getRights();
  }
}
