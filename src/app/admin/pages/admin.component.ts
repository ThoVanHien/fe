import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}
