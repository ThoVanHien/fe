import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email = 'admin@learning.test';
  password = 'admin123';
  errorMessage = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  login(): void {
    const isLoggedIn = this.authService.login(this.email, this.password);

    if (!isLoggedIn) {
      this.errorMessage = 'Use admin@learning.test and admin123 for this mock login.';
      return;
    }

    this.router.navigate(['/admin/dashboard']);
  }
}

