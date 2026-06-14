import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// DTOs
import { StudentRegistrationRequestDto } from '../../../../models/auth/request/student-request.dto';
import { Teacher } from '../../../../models/auth/request/teacher-request.dto';
import { NoticeRequest } from '../../../../models/auth/request/Notice-Request.dto';

import { SchoolAdminResponse } from '../../../../models/auth/response/School-Admin-Response.dto';
import { apiResponseDto } from '../../../../models/auth/response/api-response.dto';

import { SchoolAdminRegistrationRequest } from '../../../../models/auth/request/School-Admin-reqest.dto';
import { StateAdminVerifyOtpRequest } from '../../../../models/auth/request/State-Admin-VerifyOtp-request.dto';
import { StudentVerifyOtpRequestDto } from 'app/models/auth/request/student-Create-varify.dto';

@Injectable({
  providedIn: 'root'
})
export class SchoolAdminService {

  private readonly BASE_URL = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // ================= DASHBOARD =================
  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/admin/dashboard`)
      .pipe(catchError(this.handleError));
  }

  // ================= STUDENT FLOW =================

  createStudent(request: StudentRegistrationRequestDto) {
    return this.http.post(
      `${this.BASE_URL}/students/register`,
      request
    ).pipe(catchError(this.handleError));
  }

  verifyStudent(request: StudentVerifyOtpRequestDto) {
    return this.http.post(
      `${this.BASE_URL}/students/verify`,
      request
    ).pipe(catchError(this.handleError));
  }

  // 🔥 FIXED PAGINATION (IMPORTANT)
  getStudents(page: number, size: number): Observable<any> {
    return this.http.get<any>(
      `${this.BASE_URL}/students?page=${page}&size=${size}`
    ).pipe(catchError(this.handleError));
  }

  updateStudent(id: number, student: StudentRegistrationRequestDto) {
    return this.http.put(
      `${this.BASE_URL}/students/${id}`,
      student
    ).pipe(catchError(this.handleError));
  }

  deleteStudent(id: number) {
    return this.http.delete(
      `${this.BASE_URL}/students/${id}`
    ).pipe(catchError(this.handleError));
  }

  // ================= TEACHERS =================
  getTeachers(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(
      `${this.BASE_URL}/teachers`
    ).pipe(catchError(this.handleError));
  }

  createTeacher(teacher: Teacher) {
    return this.http.post(
      `${this.BASE_URL}/teachers`,
      teacher
    ).pipe(catchError(this.handleError));
  }

  updateTeacher(id: number, teacher: Teacher) {
    return this.http.put(
      `${this.BASE_URL}/teachers/${id}`,
      teacher
    ).pipe(catchError(this.handleError));
  }

  deleteTeacher(id: number) {
    return this.http.delete(
      `${this.BASE_URL}/teachers/${id}`
    ).pipe(catchError(this.handleError));
  }

  // ================= NOTICES =================
  getNotices(): Observable<NoticeRequest[]> {
    return this.http.get<NoticeRequest[]>(
      `${this.BASE_URL}/notices`
    ).pipe(catchError(this.handleError));
  }

  createNotice(notice: NoticeRequest) {
    return this.http.post(
      `${this.BASE_URL}/notices`,
      notice
    ).pipe(catchError(this.handleError));
  }

  updateNotice(id: number, notice: NoticeRequest) {
    return this.http.put(
      `${this.BASE_URL}/notices/${id}`,
      notice
    ).pipe(catchError(this.handleError));
  }

  deleteNotice(id: number) {
    return this.http.delete(
      `${this.BASE_URL}/notices/${id}`
    ).pipe(catchError(this.handleError));
  }

  // ================= SCHOOL ADMIN =================
  registerSchoolAdmin(request: SchoolAdminRegistrationRequest) {
    return this.http.post(
      `${this.BASE_URL}/school-admins/register`,
      request
    ).pipe(catchError(this.handleError));
  }

  verifySchoolAdmin(request: StateAdminVerifyOtpRequest) {
    return this.http.post(
      `${this.BASE_URL}/school-admins/verify`,
      request
    ).pipe(catchError(this.handleError));
  }

  getAdminsBySchool(schoolId: number, loggedInUserId: number) {
    return this.http.get<apiResponseDto<SchoolAdminResponse[]>>(
      `${this.BASE_URL}/school-admins/school/${schoolId}?loggedInUserId=${loggedInUserId}`
    ).pipe(catchError(this.handleError));
  }

  assignSchoolAdmin(request: any) {
    return this.http.post(
      `${this.BASE_URL}/school-admins/assign`,
      request
    ).pipe(catchError(this.handleError));
  }

  deleteSchoolAdmin(id: number) {
    return this.http.delete(
      `${this.BASE_URL}/school-admins/${id}`
    ).pipe(catchError(this.handleError));
  }

  toggleSchoolAdminStatus(id: number, isActive: boolean) {
    return this.http.patch(
      `${this.BASE_URL}/school-admins/${id}/status?isActive=${isActive}`,
      {}
    ).pipe(catchError(this.handleError));
  }

  countSchoolAdmins() {
    return this.http.get<number>(
      `${this.BASE_URL}/school-admins/count`
    ).pipe(catchError(this.handleError));
  }

  // ================= ERROR HANDLING =================
  private handleError(error: HttpErrorResponse) {
    console.error('❌ API ERROR:', error);

    let message = 'Something went wrong!';

    if (error.error?.message) {
      message = error.error.message;
    } else if (error.status) {
      message = `Server Error: ${error.status}`;
    }

    return throwError(() => new Error(message));
  }
}