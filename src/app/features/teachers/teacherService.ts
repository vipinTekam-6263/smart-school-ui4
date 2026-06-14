import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { TeacherStatus } from 'app/models/enums/TeacherStatus';
import { apiResponseDto } from 'app/models/auth/response/api-response.dto';
import { Teacher } from 'app/models/auth/request/teacher-request.dto';
import { TeacherVerifyOtpRequest } from 'app/models/auth/request/TeacherVerifyOtpRequest';
import { TeacherResponse } from 'app/models/auth/response/teacherResponse';
import { PageResponse } from 'app/models/auth/response/pagination-response.dto';
import { TeacherUpdateRequest } from 'app/models/auth/request/teacherupdte';
@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  private apiBaseUrl = `${environment.apiBaseUrl}/teachers`;

  constructor(private http: HttpClient) {}

  // ================= REGISTER (SEND OTP) =================
  registerTeacher(data: Teacher): Observable<apiResponseDto<any>> {
    return this.http.post<apiResponseDto<any>>(
      `${this.apiBaseUrl}/register`,
      data
    );
  }

  // ================= VERIFY OTP =================
  verifyTeacher(data: TeacherVerifyOtpRequest): Observable<apiResponseDto<any>> {
    return this.http.post<apiResponseDto<any>>(
      `${this.apiBaseUrl}/verify`,
      data
    );
  }

  // ================= GET ALL TEACHERS =================
getAllTeachers(page: number, size: number): Observable<PageResponse<TeacherResponse>> {
  return this.http.get<PageResponse<TeacherResponse>>(
    `${this.apiBaseUrl}?page=${page}&size=${size}`
  );
}

  // ================= GET TEACHER BY ID =================
  getTeacherById(id: number): Observable<apiResponseDto<TeacherResponse>> {
    return this.http.get<apiResponseDto<TeacherResponse>>(
      `${this.apiBaseUrl}/${id}`
    );
  }

  // ================= UPDATE TEACHER =================
// ================= UPDATE TEACHER =================
updateTeacher(id: number, data: TeacherUpdateRequest): Observable<apiResponseDto<any>> {
  return this.http.put<apiResponseDto<any>>(
    `${this.apiBaseUrl}/${id}`,
    data
  );
}

  // ================= DELETE TEACHER =================
  deleteTeacher(id: number): Observable<apiResponseDto<any>> {
    return this.http.delete<apiResponseDto<any>>(
      `${this.apiBaseUrl}/${id}`
    );
  }

  // teacher.service.ts

updateTeacherStatus(id: number): Observable<any> {
  return this.http.put(`${this.apiBaseUrl}/${id}/status`, {});
}
}