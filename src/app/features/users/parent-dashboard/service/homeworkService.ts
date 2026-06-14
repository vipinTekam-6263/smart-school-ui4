import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

import { HomeworkDto } from 'app/models/auth/response/HomeworkDto';
import { HomeworkRequestDto } from 'app/models/auth/request/HomeworkRequestDto';

@Injectable({
  providedIn: 'root'
})
export class HomeworkService {

  private baseUrl = `${environment.apiBaseUrl}/homework`;

  constructor(private http: HttpClient) {}

  // ================= CREATE HOMEWORK =================
  createHomework(payload: HomeworkRequestDto): Observable<HomeworkDto> {
    return this.http.post<HomeworkDto>(
      `${this.baseUrl}/create`,
      payload
    );
  }

  // ================= GET ALL HOMEWORK =================
  getAllHomework(): Observable<HomeworkDto[]> {
    return this.http.get<HomeworkDto[]>(
      `${this.baseUrl}/all`
    );
  }

  // ================= GET TEACHER HOMEWORK =================
  getTeacherHomework(): Observable<HomeworkDto[]> {
    return this.http.get<HomeworkDto[]>(
      `${this.baseUrl}/teacher`
    );
  }

  // ================= PENDING COUNT =================
  getPendingCount(teacherId: number): Observable<number> {
    return this.http.get<number>(
      `${this.baseUrl}/teacher/${teacherId}/pending-count`
    );
  }

  // ================= SUBMIT HOMEWORK =================
  submitHomework(id: number): Observable<string> {
    return this.http.put(
      `${this.baseUrl}/submit/${id}`,
      {}
    , { responseType: 'text' });
  }
deleteHomework(id: number): Observable<any> {
  return this.http.delete(`${this.baseUrl}/${id}`);
}
}