import { Component, OnInit } from '@angular/core';

import { BlogPermission, BlogRight, BlogRole } from '../../../core/models';
import { AdminService } from '../../../core/services';

@Component({
  selector: 'app-rights',
  templateUrl: './rights.component.html'
})
export class RightsComponent implements OnInit {
  readonly rightColumns = ['role', 'permission', 'area', 'status', 'action'];
  readonly permissions: BlogPermission[] = [
    'CreatePost',
    'EditPost',
    'PublishPost',
    'DeletePost',
    'ManageUsers',
    'ViewAnalytics'
  ];

  roles: BlogRole[] = [];
  rights: BlogRight[] = [];

  newRight: Omit<BlogRight, 'id'> = {
    role: 'Author',
    permission: 'CreatePost',
    area: 'Posts',
    enabled: true
  };

  constructor(private readonly adminService: AdminService) {}

  ngOnInit(): void {
    this.roles = this.adminService.getRoles();
    this.rights = this.adminService.getRights();
  }

  addRight(): void {
    this.adminService.addRight(this.newRight);
    this.rights = this.adminService.getRights();
    this.newRight = {
      role: 'Author',
      permission: 'CreatePost',
      area: 'Posts',
      enabled: true
    };
  }

  toggleRight(rightId: number): void {
    this.rights = this.adminService.toggleRight(rightId);
  }

  trackByRightId(_index: number, right: BlogRight): number {
    return right.id;
  }
}
