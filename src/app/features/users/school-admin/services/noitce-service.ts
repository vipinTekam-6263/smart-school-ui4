import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

import { NoticeRequest } from 'app/models/auth/request/Notice-Request.dto';
import { NoticeResponse } from 'app/models/auth/response/Notice-Response.dto';
import { apiResponseDto } from 'app/models/auth/response/api-response.dto';
@Injectable({
  providedIn: 'root'
})
export class NoticeService {

  private baseUrl = `${environment.apiBaseUrl}/notices`;

  constructor(private http: HttpClient) {}

  // ================= CREATE NOTICE =================
  createNotice(
    request: NoticeRequest
  ): Observable<apiResponseDto<number>> {
    return this.http.post<apiResponseDto<number>>(
      `${this.baseUrl}`,
      request
    );
  }

  // ================= UPDATE NOTICE =================
  updateNotice(
    noticeId: number,
    request: NoticeRequest
  ): Observable<apiResponseDto<void>> {
    return this.http.put<apiResponseDto<void>>(
      `${this.baseUrl}/${noticeId}`,
      request
    );
  }

  // ================= DEACTIVATE NOTICE =================
  deactivateNotice(
    noticeId: number
  ): Observable<apiResponseDto<void>> {
    return this.http.put<apiResponseDto<void>>(
      `${this.baseUrl}/deactivate/${noticeId}`,
      {}
    );
  }

  // ================= SCHOOL NOTICES =================
  getSchoolNotices(
    schoolId: number
  ): Observable<apiResponseDto<NoticeResponse[]>> {
    return this.http.get<apiResponseDto<NoticeResponse[]>>(
      `${this.baseUrl}/school/${schoolId}`
    );
  }

  // ================= PARENT NOTICES =================
  getParentNotices(
    schoolId: number,
    classId: number,
    sectionId: number
  ): Observable<apiResponseDto<NoticeResponse[]>> {
    return this.http.get<apiResponseDto<NoticeResponse[]>>(
      `${this.baseUrl}/parent`,
      {
        params: {
          schoolId,
          classId,
          sectionId
        }
      }
    );
  }

  // ================= TEACHER NOTICES =================
  getTeacherNotices(
    schoolId: number,
    classId: number,
    sectionId: number
  ): Observable<apiResponseDto<NoticeResponse[]>> {
    return this.http.get<apiResponseDto<NoticeResponse[]>>(
      `${this.baseUrl}/teacher`,
      {
        params: {
          schoolId,
          classId,
          sectionId
        }
      }
    );
  }
}