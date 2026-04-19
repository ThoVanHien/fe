import { Pipe, PipeTransform } from '@angular/core';

import { BlogPermission } from '../../core/models';

@Pipe({
  name: 'permissionLabel'
})
export class PermissionLabelPipe implements PipeTransform {
  private readonly labels: Record<BlogPermission, string> = {
    CreatePost: 'Create post',
    EditPost: 'Edit post',
    PublishPost: 'Publish post',
    DeletePost: 'Delete post',
    ManageUsers: 'Manage users',
    ViewAnalytics: 'View analytics'
  };

  transform(value: BlogPermission): string {
    return this.labels[value];
  }
}

