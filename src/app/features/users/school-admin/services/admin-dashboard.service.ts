import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// DTO
import { AdminDashboardDto } from 'app/models/auth/response/AdminDashboardDto';
@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {

  private readonly BASE_URL = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // =====================================================
  // 📊 ADMIN DASHBOARD API
  // =====================================================
  getAdminDashboard(): Observable<AdminDashboardDto> {
    return this.http.get<AdminDashboardDto>(
      `${this.BASE_URL}/admin/dashboard`
    ).pipe(
      catchError(this.handleError)
    );
  }

  // =====================================================
  // ❌ ERROR HANDLING
  // =====================================================
  private handleError(error: HttpErrorResponse) {
    console.error('❌ Dashboard API Error:', error);

    let message = 'Something went wrong while loading dashboard';

    if (error.error?.message) {
      message = error.error.message;
    } else if (error.status) {
      message = `Server Error: ${error.status}`;
    }

    return throwError(() => new Error(message));
  }
}