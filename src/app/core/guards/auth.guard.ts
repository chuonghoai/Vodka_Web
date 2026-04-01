import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserState } from '../states/user.state';

export const adminGuard: CanActivateFn = () => {
  const userState = inject(UserState);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true; // Bypass on server side, let client side handle the real verification
  }

  const user = userState.currentUser();

  // Check role user
  if (user && (user.role === 'ADMIN' || user.role === 'admin')) {
    return true;
  }

  // Redirect to forbidden page
  router.navigate(['/forbidden']);
  return false;
};
