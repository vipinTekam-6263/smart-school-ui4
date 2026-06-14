import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SubscriptionRequestDTO } from 'app/models/auth/request/SubscriptionRequestDTO';
import { SubscriptionResponseDTO } from 'app/models/auth/response/SubscriptionResponseDTO';
@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  private baseUrl = 'http://localhost:8080/api/subscription';

  constructor(private http: HttpClient) {}

  // ✅ Create Subscription
  createSubscription(data: SubscriptionRequestDTO): Observable<SubscriptionResponseDTO> {
    return this.http.post<SubscriptionResponseDTO>(this.baseUrl, data);
  }

  // ✅ Get All Subscriptions
  getAllSubscriptions(): Observable<SubscriptionResponseDTO[]> {
    return this.http.get<SubscriptionResponseDTO[]>(this.baseUrl);
  }

  // ✅ Get By ID
  getSubscriptionById(id: number): Observable<SubscriptionResponseDTO> {
    return this.http.get<SubscriptionResponseDTO>(`${this.baseUrl}/${id}`);
  }

  // ✅ Get Active Subscriptions
  getActiveSubscriptions(): Observable<SubscriptionResponseDTO[]> {
    return this.http.get<SubscriptionResponseDTO[]>(`${this.baseUrl}/active`);
  }

  // ✅ Update Subscription
  updateSubscription(id: number, data: SubscriptionRequestDTO): Observable<SubscriptionResponseDTO> {
    return this.http.put<SubscriptionResponseDTO>(`${this.baseUrl}/${id}`, data);
  }

  // ✅ Delete Subscription
  deleteSubscription(id: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }
}