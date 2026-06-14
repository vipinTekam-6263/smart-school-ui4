import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MessageService {

  successMessage = '';
  errorMessage = '';

  showSuccess(msg: string, time = 10000) {
    this.successMessage = msg;

    setTimeout(() => {
      this.successMessage = '';
    }, time);
  }

  showError(msg: string, time = 10000) {
    this.errorMessage = msg;

    setTimeout(() => {
      this.errorMessage = '';
    }, time);
  }

  clear() {
    this.successMessage = '';
    this.errorMessage = '';
  }
}