import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LandingPageService {

  private schoolUrl = 'http://localhost:8080/api/schools';
  private studentUrl = 'http://localhost:8080/api/students';

  constructor(private http: HttpClient) {}

  // ================= ACTIVE SCHOOLS STATS =================
  getActiveSchoolsCount(): Observable<any> {
    return this.http.get<any>(`${this.schoolUrl}/stats/schools`);
  }

  // ================= STUDENT STATS =================
  getStudentCount(): Observable<any> {
    return this.http.get<any>(`${this.studentUrl}/stats/count`);
  }

  // ================= ALL SCHOOLS (optional) =================
  getAllSchools(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get<any>(
      `${this.schoolUrl}?page=${page}&size=${size}`
    );
  }
}