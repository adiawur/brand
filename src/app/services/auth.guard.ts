import {
  inject
} from '@angular/core';

import {
  CanActivateFn,
  Router
} from '@angular/router';

import {
  AuthService
} from './auth.service';


export const authGuard: CanActivateFn = (
  route,
  state
) => {

  const authService =
    inject(AuthService);

  const router =
    inject(Router);


  // =========================================================
  // CHECK LOGIN
  // =========================================================

  if (!authService.isLoggedIn()) {

    return router.createUrlTree(
      ['/login'],
      {
        queryParams: {
          returnUrl: state.url
        }
      }
    );
  }


  // =========================================================
  // GET USER ROLE
  // =========================================================

  const userRole =
    authService
      .getRole()
      ?.toUpperCase();


  // =========================================================
  // GET REQUIRED ROLE
  // =========================================================

  const requiredRole =
    route.data['role'] as string | undefined;


  // =========================================================
  // NO ROLE RESTRICTION
  // =========================================================

  if (!requiredRole) {

    return true;
  }


  // =========================================================
  // CHECK ROLE
  // =========================================================

  if (
    userRole ===
    requiredRole.toUpperCase()
  ) {

    return true;
  }


  // =========================================================
  // WRONG ROLE
  // =========================================================

  if (userRole === 'ADMIN') {

    return router.createUrlTree([
      '/admin/dashboard'
    ]);
  }


  if (userRole === 'SUPERVISOR') {

    return router.createUrlTree([
      '/supervisor/dashboard'
    ]);
  }


  if (userRole === 'TECHNICIAN') {

    return router.createUrlTree([
      '/technician/dashboard'
    ]);
  }


  // =========================================================
  // UNKNOWN ROLE
  // =========================================================

  authService.logout();

  return router.createUrlTree([
    '/login'
  ]);
};