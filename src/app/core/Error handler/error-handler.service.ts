import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  handleError(error: any): string {

    let errorMessage = 'Something went wrong';

    if (error instanceof HttpErrorResponse) {

      if (error.status === 0) {
        errorMessage = 'No internet connection';
      } 
      else if (error.error?.message) {
        errorMessage = error.error.message;
      } 
      else {
        errorMessage = `Server error: ${error.status}`;
      }

    } 
    else if (error instanceof Error) {
      errorMessage = error.message;
    }

    console.error('API Error:', error);

    return errorMessage;
  }
}