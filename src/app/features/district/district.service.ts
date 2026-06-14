import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { DistrictRequest } from 'app/models/auth/request/District-Request.dto';
import { DistrictResponse } from 'app/models/auth/response/district-response.dto';
import { PageResponse } from 'app/models/auth/response/pagination-response.dto';
import { apiResponseDto } from 'app/models/auth/response/api-response.dto';

@Injectable({
  providedIn: 'root'
})
export class DistrictService {

  private baseUrl = `${environment.apiBaseUrl}/districts`;

  constructor(private http: HttpClient) {}

  // ================= ADD DISTRICT =================
  addDistrict(request: DistrictRequest): Observable<apiResponseDto<null>> {
    return this.http.post<apiResponseDto<null>>(this.baseUrl, request)
      .pipe(catchError(this.handleError));
  }

  // ================= GET ALL (Pagination) =================
  getAllDistricts(page: number = 0, size: number = 10): Observable<PageResponse<DistrictResponse>> {
    return this.http.get<PageResponse<DistrictResponse>>(
      `${this.baseUrl}?page=${page}&size=${size}`
    ).pipe(catchError(this.handleError));
  }

  // ================= GET BY ID =================
  getDistrictById(id: number): Observable<apiResponseDto<DistrictResponse>> {
    return this.http.get<apiResponseDto<DistrictResponse>>(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // ================= UPDATE =================
  updateDistrict(id: number, request: DistrictRequest): Observable<apiResponseDto<null>> {
    return this.http.put<apiResponseDto<null>>(`${this.baseUrl}/${id}`, request)
      .pipe(catchError(this.handleError));
  }

  // ================= DELETE =================
  deleteDistrict(id: number): Observable<apiResponseDto<null>> {
    return this.http.delete<apiResponseDto<null>>(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // ================= ERROR HANDLER =================
  private handleError(error: HttpErrorResponse) {
    let msg = 'Something went wrong';

    if (error.error?.message) {
      msg = error.error.message;
    } else if (error.status === 0) {
      msg = 'Server not reachable';
    }

    console.error('District API Error:', msg);
    return throwError(() => new Error(msg));
  }
}