import { Component, OnInit } from '@angular/core';

import { BlogRole, BlogUser, UserStatus } from '../../../core/models';
import { AdminService } from '../../../core/services';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {
  readonly statuses: UserStatus[] = ['Active', 'Inactive'];
  readonly userColumns = ['name', 'email', 'githubUsername', 'role', 'status', 'actions'];
  roles: BlogRole[] = [];
  users: BlogUser[] = [];
  selectedRole: BlogRole | 'All' = 'All';

  newUser: Omit<BlogUser, 'id'> = {
    name: '',
    email: '',
    githubUsername: '',
    role: 'Author',
    status: 'Active'
  };

  constructor(private readonly adminService: AdminService) {}

  ngOnInit(): void {
    this.roles = this.adminService.getRoles();
    this.users = this.adminService.getUsers();
  }

  get filteredUsers(): BlogUser[] {
    if (this.selectedRole === 'All') {
      return this.users;
    }

    return this.users.filter(user => user.role === this.selectedRole);
  }

  addUser(): void {
    this.adminService.addUser(this.newUser);
    this.users = this.adminService.getUsers();
    this.newUser = {
      name: '',
      email: '',
      githubUsername: '',
      role: 'Author',
      status: 'Active'
    };
  }

  toggleStatus(userId: number): void {
    this.users = this.adminService.toggleUserStatus(userId);
  }

  removeUser(userId: number): void {
    this.users = this.adminService.removeUser(userId);
  }

  trackByUserId(_index: number, user: BlogUser): number {
    return user.id;
  }
}
