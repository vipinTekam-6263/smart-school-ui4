import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RevenueService {

  private baseUrl = 'http://localhost:8080/api/revenue';

  constructor(private http: HttpClient) {}

  // 💰 Total Revenue
  getTotalRevenue(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/total`);
  }

  // 💰 Revenue by District
  getRevenueByDistrict(districtId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/district/${districtId}`);
  }

  // 💰 Revenue by Plan
  getRevenueByPlan(planId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/plan/${planId}`);
  }


getFilteredRevenue(fromDate: string, toDate: string) {

  return this.http.get<number>(
    `${this.baseUrl}/filter?fromDate=${fromDate}&toDate=${toDate}`
  );
}
}