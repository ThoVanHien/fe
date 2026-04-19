import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly loggedIn$ = this.authService.loggedIn$;
  readonly returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/admin';

  login(): void {
    this.authService.login();
    void this.router.navigateByUrl(this.returnUrl);
  }
}
