import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '@env/environment';
import { GlobalExceptionHandlerService } from 'app/core/Handler/global-exception-handler.service';

@Injectable({
  providedIn: 'root'
})
export class SuperAdminService {

  private baseUrl = `${environment.apiBaseUrl}/dashboard`;

  constructor(
    private http: HttpClient,
    private exceptionHandler: GlobalExceptionHandlerService
  ) {}

  getTotalStates(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/total-states`)
      .pipe(catchError(error => this.exceptionHandler.handleError(error)));
  }

  getTotalDistricts(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/total-districts`)
      .pipe(catchError(error => this.exceptionHandler.handleError(error)));
  }

  getTotalSchools(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/total-schools`)
      .pipe(catchError(error => this.exceptionHandler.handleError(error)));
  }

  getRevenue(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/revenue`)
      .pipe(catchError(error => this.exceptionHandler.handleError(error)));
  }

  getActiveUsers(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/active-users`)
      .pipe(catchError(error => this.exceptionHandler.handleError(error)));
  }

  getDashboardCounts(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/counts`, {})
      .pipe(catchError(error => this.exceptionHandler.handleError(error)));
  }
}