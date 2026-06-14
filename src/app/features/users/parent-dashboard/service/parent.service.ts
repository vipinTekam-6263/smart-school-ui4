import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@env/environment';
import { ParentDashboardDto } from 'app/models/auth/response/ParentDashboardDto';
import { apiResponseDto } from 'app/models/auth/response/api-response.dto';

@Injectable({
  providedIn: 'root'
})
export class ParentDashboardService {

  private baseUrl = `${environment.apiBaseUrl}/parent/dashboard`;

  constructor(private http: HttpClient) {}

  // ================= PARENT DASHBOARD =================
  getDashboard(): Observable<apiResponseDto<ParentDashboardDto>> {
    return this.http.get<apiResponseDto<ParentDashboardDto>>(
      `${this.baseUrl}`
    );
  }

}