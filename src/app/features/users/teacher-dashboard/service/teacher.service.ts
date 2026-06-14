import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@env/environment';

import { TeacherDashboardResponseDto } from 'app/models/auth/response/TeacherDashboardResponseDto';
import { AttendanceRequestDto } from 'app/models/auth/request/AttendanceRequestDto';
import { HomeworkDto } from 'app/models/auth/response/HomeworkDto';
import { AttendanceResponseDto } from 'app/models/auth/response/AttendanceResponseDto';
import { NoticeResponse } from 'app/models/auth/response/Notice-Response.dto';
import { HomeworkRequestDto } from 'app/models/auth/request/HomeworkRequestDto';

import { apiResponseDto } from 'app/models/auth/response/api-response.dto';

@Injectable({
  providedIn: 'root'
})
export class TeacherDashboardService {

  private apiBaseUrl = `${environment.apiBaseUrl}`;

  constructor(private http: HttpClient) {}

  // ================= DASHBOARD =================
  getTeacherDashboard(): Observable<apiResponseDto<TeacherDashboardResponseDto>> {
    return this.http.get<apiResponseDto<TeacherDashboardResponseDto>>(
      `${this.apiBaseUrl}/teacher-dashboard`
    );
  }

  // ================= ATTENDANCE =================

  markAttendance(data: AttendanceRequestDto): Observable<apiResponseDto<any>> {
    return this.http.post<apiResponseDto<any>>(
      `${this.apiBaseUrl}/attendance`,
      data
    );
  }

  getSectionAttendance(
    sectionId: number,
    date: string
  ): Observable<apiResponseDto<AttendanceResponseDto[]>> {

    const params = new HttpParams()
      .set('sectionId', sectionId)
      .set('date', date);

    return this.http.get<apiResponseDto<AttendanceResponseDto[]>>(
      `${this.apiBaseUrl}/attendance/section`,
      { params }
    );
  }

  // ================= HOMEWORK =================

  createHomework(data: HomeworkRequestDto): Observable<apiResponseDto<any>> {
    return this.http.post<apiResponseDto<any>>(
      `${this.apiBaseUrl}/homework/create`,
      data
    );
  }

  getAllHomework(): Observable<apiResponseDto<HomeworkDto[]>> {
    return this.http.get<apiResponseDto<HomeworkDto[]>>(
      `${this.apiBaseUrl}/homework/all`
    );
  }

  getHomeworkByTeacher(teacherId: number): Observable<apiResponseDto<HomeworkDto[]>> {
    return this.http.get<apiResponseDto<HomeworkDto[]>>(
      `${this.apiBaseUrl}/homework/teacher/${teacherId}`
    );
  }

  // ================= NOTICES =================

  getTeacherNotices(
    schoolId: number,
    classId: number,
    sectionId: number
  ): Observable<apiResponseDto<NoticeResponse[]>> {

    const params = new HttpParams()
      .set('schoolId', schoolId)
      .set('classId', classId)
      .set('sectionId', sectionId);

    return this.http.get<apiResponseDto<NoticeResponse[]>>(
      `${this.apiBaseUrl}/notices/teacher`,
      { params }
    );
  }
}