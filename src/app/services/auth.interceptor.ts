import {
  HttpInterceptorFn
} from '@angular/common/http';


export const authInterceptor: HttpInterceptorFn =
  (req, next) => {


    // =====================================================
    // PUBLIC ENDPOINTS
    // DO NOT ATTACH JWT
    // =====================================================

    if (

      // Authentication
      req.url.includes('/api/auth/')

      ||

      // Public incident reporting
      req.url.includes('/api/incidents/report')

      ||

      // Public incident tracking
      req.url.includes('/api/incidents/track')

      ||

      // Public customer complaint / feedback
      

      req.url.includes('/api/incidents/complaint')

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