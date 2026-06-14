import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { ExpiredTokenException } from '../../core/Exception/expired-token.exception';
import { InvalidOtpException } from '../../core/Exception//invalid-otp.exception';
import { InvalidResourceException } from '../../core/Exception//invalid-resource.exception';
import { ResourceAlreadyExistsException } from '../../core/Exception//resource-already-exists.exception';
import { ResourceNotFoundException } from '../../core/Exception//resource-not-found.exception';
import { UsernameNotFoundException } from '../../core/Exception//username-not-found.exception';

@Injectable({
  providedIn: 'root'
})
export class GlobalExceptionHandlerService {

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      console.error('Client-side error:', error.error.message);
      return throwError(() => new Error('Client-side error: ' + error.error.message));
    } else {
      // Backend errors based on HTTP status
      switch (error.status) {
        case 400:
          return throwError(() => new InvalidResourceException(error.error.message));
        case 401:
          if (error.error.message?.includes('OTP')) {
            return throwError(() => new InvalidOtpException(error.error.message));
          }
          if (error.error.message?.includes('Token')) {
            return throwError(() => new ExpiredTokenException(error.error.message));
          }
          return throwError(() => new UsernameNotFoundException(error.error.message));
        case 404:
          return throwError(() => new ResourceNotFoundException(error.error.message));
        case 409:
          return throwError(() => new ResourceAlreadyExistsException(error.error.message));
        default:
          return throwError(() => new Error(error.error.message || 'Unknown error occurred'));
      }
    }
  }
}