// exam.service.ts

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { apiResponseDto } from 'app/models/auth/response/api-response.dto';
import { ExamResponseScheduleDTO } from 'app/models/auth/response/Exam-response.dto';
import { ExamScheduleRequest } from 'app/models/auth/request/Exam-Schedule-Request.dto';

@Injectable({
  providedIn: 'root'
})
export class ExamService {

  private baseUrl = `${environment.apiBaseUrl}/exams`;

  constructor(private http: HttpClient) {}

  // ================= CREATE =================
  createExam(payload: ExamScheduleRequest): Observable<apiResponseDto<number>> {
    return this.http.post<apiResponseDto<number>>(`${this.baseUrl}`, payload);
  }

  // ================= UPDATE =================
  updateExam(id: number, payload: ExamScheduleRequest): Observable<apiResponseDto<void>> {
    return this.http.put<apiResponseDto<void>>(`${this.baseUrl}/${id}`, payload);
  }

  // ================= GET =================
  getSchoolExams(
    schoolId: number,
    academicYearId: number
  ): Observable<apiResponseDto<ExamResponseScheduleDTO[]>> {

    const params = new HttpParams()
      .set('academicYearId', academicYearId);

    return this.http.get<apiResponseDto<ExamResponseScheduleDTO[]>>(
      `${this.baseUrl}/school/${schoolId}`,
      { params }
    );
  }

  // ================= DELETE =================
  deleteExam(id: number): Observable<apiResponseDto<void>> {
    return this.http.delete<apiResponseDto<void>>(`${this.baseUrl}/${id}`);
  }

  // ================= ACADEMIC YEAR =================
getAcademicYears(schoolId: number) {
  return this.http.get(`http://localhost:8080/api/exams/academic-years/${schoolId}`);
}


}