import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    console.log('🔥 INTERCEPTOR WORKING');
    console.log('➡️ Request URL:', req.url);

    // 🔥 STEP 1: SKIP AUTH APIs
    if (
      req.url.includes('/auth/login') ||
      req.url.includes('/auth/verify-otp') ||
      req.url.includes('/otp/')
    ) {
      console.log('⏭️ Skipping token for auth APIs');
      return next.handle(req);
    }

    // 🔥 STEP 2: GET TOKEN
    const token = localStorage.getItem('token');

    if (token && token.trim() !== '') {

      console.log('🔐 Token FOUND:', token.substring(0, 20) + '...');

      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('✅ Authorization header added');

    } else {
      console.warn('⚠️ NO TOKEN FOUND in localStorage');
    }

    // 🔥 STEP 3: HANDLE RESPONSE
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {

        console.error('❌ HTTP ERROR:', error.status, error.message);

        // ✅ ONLY logout for REAL auth failure
        if (error.status === 401 && !error.error?.message) {

          console.warn('🚨 REAL 401 Unauthorized - clearing session');

          localStorage.clear();

          if (this.router.url !== '/') {
            this.router.navigate(['/']);
          }

        } else {

          // ✅ BUSINESS / VALIDATION ERROR (NO LOGOUT)
          console.log('⚠️ API ERROR MESSAGE:', error.error?.message);

        }

        return throwError(() => error);
      })
    );
  }
}