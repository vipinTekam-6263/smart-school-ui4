import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MasterDataService {

  private readonly baseUrl = 'http://localhost:8080/api/master-data';

  constructor(private http: HttpClient) {}

  // ================= MASTER DATA FOR TEACHER ASSIGN =================
  getTeacherAssignData(schoolId: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/teacher-assign/${schoolId}`
    );
  }
}