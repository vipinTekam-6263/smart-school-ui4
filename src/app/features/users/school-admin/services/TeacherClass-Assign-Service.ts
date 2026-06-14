import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { TeacherClassAssignRequestDto } from 'app/models/auth/request/teacher-class-assign-request.dto';
import { apiResponseDto } from 'app/models/auth/response/api-response.dto';

@Injectable({
  providedIn: 'root'
})
export class TeacherClassService {

  private baseUrl = 'http://localhost:8080/api/teacher-classes';

  constructor(private http: HttpClient) {}

  // ================= ASSIGN TEACHER TO CLASS =================
  assignTeacher(
    payload: TeacherClassAssignRequestDto
  ): Observable<apiResponseDto<number>> {
    return this.http.post<apiResponseDto<number>>(
      this.baseUrl,
      payload
    );
  }

  // ================= GET TEACHER CLASSES =================
  getTeacherClasses(
    teacherId: number,
    academicYearId: number
  ): Observable<apiResponseDto<any[]>> {

    let params = new HttpParams().set(
      'academicYearId',
      academicYearId
    );

    return this.http.get<apiResponseDto<any[]>>(
      `${this.baseUrl}/teacher/${teacherId}/classes`,
      { params }
    );
  }

  // ================= REMOVE TEACHER FROM CLASS =================
  removeTeacherFromClass(
    teacherClassId: number
  ): Observable<apiResponseDto<void>> {

    return this.http.delete<apiResponseDto<void>>(
      `${this.baseUrl}/${teacherClassId}`
    );
  }

  getTeachers(page: number = 0, size: number = 10) {
  return this.http.get<any>(
    `http://localhost:8080/api/teachers?page=${page}&size=${size}`
  );
}
}