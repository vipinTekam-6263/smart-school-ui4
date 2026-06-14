import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { PlanRequestDTO } from 'app/models/auth/request/PlanRequestDTO';
import { PlanResponseDTO } from 'app/models/auth/response/PlanResponseDTO';
@Injectable({
  providedIn: 'root'
})
export class PlanService {

  private baseUrl = 'http://localhost:8080/api/plan';

  constructor(private http: HttpClient) {}

  // ✅ Create Plan
  createPlan(data: PlanRequestDTO): Observable<PlanResponseDTO> {
    return this.http.post<PlanResponseDTO>(this.baseUrl, data);
  }

  // ✅ Get All Plans
  getAllPlans(): Observable<PlanResponseDTO[]> {
    return this.http.get<PlanResponseDTO[]>(this.baseUrl);
  }

  // ✅ Get Plan By ID
  getPlanById(id: number): Observable<PlanResponseDTO> {
    return this.http.get<PlanResponseDTO>(`${this.baseUrl}/${id}`);
  }

  // ✅ Update Plan
  updatePlan(id: number, data: PlanRequestDTO): Observable<PlanResponseDTO> {
    return this.http.put<PlanResponseDTO>(`${this.baseUrl}/${id}`, data);
  }

  // ✅ Delete Plan
  deletePlan(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }
}