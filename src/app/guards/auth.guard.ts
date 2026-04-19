import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../core/auth.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn()
    ? true
    : router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};

export const adminMatchGuard: CanMatchFn = (_route, segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const attemptedUrl = `/${segments.map((segment) => segment.path).join('/')}`;

  return authService.isLoggedIn()
    ? true
    : router.createUrlTree(['/login'], { queryParams: { returnUrl: attemptedUrl || '/admin' } });
};
