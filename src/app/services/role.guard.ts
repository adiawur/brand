import {
  inject
} from '@angular/core';

import {
  CanActivateFn,
  Router
} from '@angular/router';


export const roleGuard: CanActivateFn =
  (route) => {

    const router =
      inject(Router);


    const token =
      sessionStorage.getItem(
        'zeco_token'
      );


    const role =
      sessionStorage.getItem(
        'zeco_role'
      );


    if (!token) {

      return router.createUrlTree(
        ['/login']
      );
    }


    const allowedRoles =
      route.data['roles'] as string[];


    if (
      allowedRoles
        .map(role =>
          role.toUpperCase()
        )
        .includes(
          (role ?? '').toUpperCase()
        )
    ) {

      return true;
    }


    return router.createUrlTree(
      ['/unauthorized']
    );
  };