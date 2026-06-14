import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '@env/environment';
import { apiResponseDto } from 'app/models/auth/response/api-response.dto';
import { DistrictAdminResponse } from 'app/models/auth/response/district-admin-response.dto';
import { DashboardStats } from 'app/models/auth/response/dashboard-stats.dto';
import { PageResponse } from 'app/models/auth/response/pagination-response.dto';
import { GlobalExceptionHandlerService } from 'app/core/Handler/global-exception-handler.service';

@Injectable({
  providedIn: 'root'
})
export class DistrictAdminService {

  private baseUrl = `${environment.apiBaseUrl}/district-admins`;

  constructor(
    private http: HttpClient,
    private exceptionHandler: GlobalExceptionHandlerService
  ) {}

  // ================= REGISTER =================
  registerDistrictAdmin(payload: any): Observable<apiResponseDto<void>> {
    return this.http.post<apiResponseDto<void>>(`${this.baseUrl}/register`, payload)
      .pipe(catchError(error => this.exceptionHandler.handleError(error)));
  }

  // ================= VERIFY =================
  verifyDistrictAdmin(payload: any): Observable<apiResponseDto<void>> {
    return this.http.post<apiResponseDto<void>>(`${this.baseUrl}/verify`, payload)
      .pipe(catchError(error => this.exceptionHandler.handleError(error)));
  }

  // ================= GET ALL =================
  getAllDistrictAdmins(page: number, size: number): Observable<PageResponse<DistrictAdminResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PageResponse<DistrictAdminResponse>>(this.baseUrl, { params })
      .pipe(catchError(error => this.exceptionHandler.handleError(error)));
  }

  // ================= GET BY ID =================
  getDistrictAdminById(id: number): Observable<apiResponseDto<DistrictAdminResponse>> {
    return this.http.get<apiResponseDto<DistrictAdminResponse>>(`${this.baseUrl}/${id}`)
      .pipe(catchError(error => this.exceptionHandler.handleError(error)));
  }

  // ================= DELETE =================
  deleteDistrictAdmin(id: number): Observable<apiResponseDto<void>> {
    return this.http.delete<apiResponseDto<void>>(`${this.baseUrl}/${id}`)
      .pipe(catchError(error => this.exceptionHandler.handleError(error)));
  }

  // ================= DASHBOARD =================
  getDashboardStats(districtId: number): Observable<apiResponseDto<DashboardStats>> {
    return this.http.get<apiResponseDto<DashboardStats>>(`${this.baseUrl}/dashboard/${districtId}`)
      .pipe(catchError(error => this.exceptionHandler.handleError(error)));
  }

  // ================= COUNT =================
  countDistrictAdmins(): Observable<apiResponseDto<number>> {
    return this.http.get<apiResponseDto<number>>(`${this.baseUrl}/count`)
      .pipe(catchError(error => this.exceptionHandler.handleError(error)));
  }

}