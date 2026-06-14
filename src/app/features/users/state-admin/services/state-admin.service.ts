import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '@env/environment';
import { GlobalExceptionHandlerService } from 'app/core/Handler/global-exception-handler.service';

@Injectable({
  providedIn: 'root'
})
export class StateAdminService {

  private baseUrl = `${environment.apiBaseUrl}/state-admins`;

  constructor(
    private http: HttpClient,
    private exceptionHandler: GlobalExceptionHandlerService
  ) {}

  // ================= REGISTER =================
  registerStateAdmin(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data)
      .pipe(catchError(error => this.exceptionHandler.handleError(error)));
  }

  // ================= VERIFY OTP =================
  verifyStateAdminOtp(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/verify`, data)
      .pipe(catchError(error => this.exceptionHandler.handleError(error)));
  }

  // ================= UPDATE =================
  updateStateAdmin(data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}`, data)
      .pipe(catchError(error => this.exceptionHandler.handleError(error)));
  }

  // ================= GET ALL (PAGINATION) =================
  getAllStateAdmins(page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);

    return this.http.get(`${this.baseUrl}`, { params })
      .pipe(catchError(error => this.exceptionHandler.handleError(error)));
  }

  // ================= GET BY ID =================
  getStateAdminById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`)
      .pipe(catchError(error => this.exceptionHandler.handleError(error)));
  }

  // ================= DELETE =================
  deleteStateAdmin(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`)
      .pipe(catchError(error => this.exceptionHandler.handleError(error)));
  }

  // ================= TOGGLE STATUS =================
  toggleStatus(id: number, isActive: boolean): Observable<any> {
    const params = new HttpParams().set('isActive', isActive);
    return this.http.patch(`${this.baseUrl}/${id}/status`, {}, { params })
      .pipe(catchError(error => this.exceptionHandler.handleError(error)));
  }

  // ================= COUNT =================
  countStateAdmins(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/count`)
      .pipe(catchError(error => this.exceptionHandler.handleError(error)));
  }


  getDashboardCounts(): Observable<any> {
  return this.http.post(`${environment.apiBaseUrl}/dashboard/counts`, {});
}
}