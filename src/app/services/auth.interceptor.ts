import {
  HttpInterceptorFn
} from '@angular/common/http';


export const authInterceptor: HttpInterceptorFn =
  (req, next) => {

    // =====================================================
    // DO NOT ATTACH TOKEN TO LOGIN/AUTH
    // =====================================================

    if (
      req.url.includes('/api/auth/')
    ) {

      return next(req);
    }


    // =====================================================
    // GET TOKEN
    // =====================================================

    const token =
      sessionStorage.getItem(
        'zeco_token'
      );


    // =====================================================
    // NO TOKEN
    // =====================================================

    if (!token) {

      return next(req);
    }


    // =====================================================
    // ATTACH JWT
    // =====================================================

    const authRequest =
      req.clone({

        setHeaders: {

          Authorization:
            `Bearer ${token}`

        }

      });


    return next(authRequest);
  };