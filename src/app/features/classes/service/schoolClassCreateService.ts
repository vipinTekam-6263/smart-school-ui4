import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SchoolClass } from 'app/models/auth/request/SchoolClass.dto';
import { CreateClassRequest } from 'app/models/auth/request/CreateClassRequest';

@Injectable({
  providedIn: 'root'
})
export class ClassService {

  private baseUrl = 'http://localhost:8080/api/classes';

  constructor(private http: HttpClient) {}

  // ================= CREATE CLASS =================
  createClass(payload: CreateClassRequest): Observable<SchoolClass> {
    return this.http.post<SchoolClass>(this.baseUrl, payload);
  }

  // ================= GET CLASS BY ID =================
  getClassById(id: number): Observable<SchoolClass> {
    return this.http.get<SchoolClass>(`${this.baseUrl}/${id}`);
  }

  // ================= GET CLASSES BY SCHOOL =================
  getClassesBySchool(schoolId: number): Observable<SchoolClass[]> {
    return this.http.get<SchoolClass[]>(`${this.baseUrl}/school/${schoolId}`);
  }

  // ================= UPDATE CLASS =================
  updateClass(id: number, payload: SchoolClass): Observable<SchoolClass> {
    return this.http.put<SchoolClass>(`${this.baseUrl}/${id}`, payload);
  }

  // ================= DELETE CLASS =================
  deleteClass(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // ================= TOGGLE STATUS (optional) =================
  updateClassStatus(id: number, isActive: boolean): Observable<SchoolClass> {
    return this.http.patch<SchoolClass>(
      `${this.baseUrl}/${id}/status`,
      { isActive }
    );
  }
}