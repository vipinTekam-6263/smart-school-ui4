// state.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { catchError, map, tap, shareReplay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { StateRequest } from 'app/models/auth/request/State-Request.dto';
import { StateResponse } from 'app/models/auth/response/State-Response.dto';
import { apiResponseDto } from 'app/models/auth/response/api-response.dto';

// export interface StateRequest {
//   stateName: string;
// }

// export interface StateResponse {
//   id: number;
//   stateName: string;
// }

// export interface ApiResponse<T> {
//   status: boolean;
//   message: string;
//   data?: T;
// }

@Injectable({
  providedIn: 'root'
})
export class StateService {
  //private readonly API_URL = `${environment.apiUrl}/states`;
    private baseUrl = `${environment.apiBaseUrl}/states`;

  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  // Cache for states list
  private statesCache$ = new BehaviorSubject<StateResponse[]>([]);
  private totalStatesCache$ = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) {}

  /**
   * 🔥 Add new state
   */
  addState(request: StateRequest): Observable<apiResponseDto<null>> {
    return this.http.post<apiResponseDto<null>>(`${this.baseUrl}/add`, request, this.httpOptions)
      .pipe(
        tap(() => this.invalidateCache()), // Clear cache on success
        catchError(this.handleError<apiResponseDto<null>>('addState'))
      );
  }

  /**
   * 🔥 Get total states count
   */
  getTotalStates(): Observable<number> {
    // Return cached value if available
    if (this.totalStatesCache$.value > 0) {
      return of(this.totalStatesCache$.value);
    }

    return this.http.get<apiResponseDto<number>>(`${this.baseUrl}/count`, this.httpOptions)
      .pipe(
        map(response => {
          if (response.status && response.data !== undefined) {
            this.totalStatesCache$.next(response.data);
            return response.data;
          }
          return 0;
        }),
        catchError(this.handleError<number>('getTotalStates'))
      );
  }

  /**
   * 🔥 Get all states (with caching)
   */
  getAllStates(): Observable<StateResponse[]> {
    // Return cached value if available and fresh
    const cachedStates = this.statesCache$.value;
    if (cachedStates.length > 0) {
      return of(cachedStates);
    }

    return this.http.get<apiResponseDto<StateResponse[]>>(`${this.baseUrl}/all`, this.httpOptions)
      .pipe(
        map(response => {
          if (response.status && response.data) {
            this.statesCache$.next(response.data);
            return response.data;
          }
          return [];
        }),
        shareReplay(1), // Cache the latest emission
        catchError(this.handleError<StateResponse[]>('getAllStates'))
      );
  }

  /**
   * 🔥 Get state by ID
   */
  getStateById(id: number): Observable<StateResponse> {
    return this.http.get<apiResponseDto<StateResponse>>(`${this.baseUrl}/by-id?id=${id}`, this.httpOptions)
      .pipe(
        map(response => {
          if (response.status && response.data) {
            return response.data;
          }
          throw new Error('State not found');
        }),
        catchError(this.handleError<StateResponse>('getStateById'))
      );
  }

  /**
   * 🔥 Update state
   */
  updateState(id: number, request: StateRequest): Observable<apiResponseDto<null>> {
    return this.http.put<apiResponseDto<null>>(`${this.baseUrl}/update?id=${id}`, request, this.httpOptions)
      .pipe(
        tap(() => this.invalidateCache()), // Clear cache on update
        catchError(this.handleError<apiResponseDto<null>>('updateState'))
      );
  }

  /**
   * 🔥 Delete state (soft delete)
   */
  deleteState(id: number): Observable<apiResponseDto<null>> {
    return this.http.delete<apiResponseDto<null>>(`${this.baseUrl}/delete?id=${id}`, this.httpOptions)
      .pipe(
        tap(() => this.invalidateCache()), // Clear cache on delete
        catchError(this.handleError<apiResponseDto<null>>('deleteState'))
      );
  }

  /**
   * 🔥 Search states by name
   */
  searchStates(searchTerm: string): Observable<StateResponse[]> {
    return this.http.get<apiResponseDto<StateResponse[]>>(`${this.baseUrl}/search?query=${encodeURIComponent(searchTerm)}`, this.httpOptions)
      .pipe(
        map(response => response.status && response.data ? response.data : []),
        catchError(this.handleError<StateResponse[]>('searchStates'))
      );
  }

  /**
   * 🔥 Bulk delete states
   */
  bulkDeleteStates(ids: number[]): Observable<apiResponseDto<null>> {
    return this.http.post<apiResponseDto<null>>(`${this.baseUrl}/bulk-delete`, { ids }, this.httpOptions)
      .pipe(
        tap(() => this.invalidateCache()),
        catchError(this.handleError<apiResponseDto<null>>('bulkDeleteStates'))
      );
  }

  /**
   * 🔥 Invalidate cache
   */
  private invalidateCache(): void {
    this.statesCache$.next([]);
    this.totalStatesCache$.next(0);
  }

  /**
   * 🔥 Centralized error handling
   */
  private handleError<T>(operation = 'operation'): (error: HttpErrorResponse) => Observable<T> {
    return (error: HttpErrorResponse): Observable<T> => {
      let errorMessage = 'An unknown error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Client Error: ${error.error.message}`;
      } else {
        // Server-side error
        if (error.status === 0) {
          errorMessage = 'Unable to connect to server';
        } else if (error.status === 400) {
          errorMessage = error.error?.message || 'Bad Request';
        } else if (error.status === 404) {
          errorMessage = 'Resource not found';
        } else if (error.status === 409) {
          errorMessage = error.error?.message || 'Resource already exists';
        } else {
          errorMessage = error.error?.message || `Server Error: ${error.status}`;
        }
      }

      console.error(`${operation}:`, errorMessage);
      
      return throwError(() => new Error(errorMessage));
    };
  }

  /**
   * 🔥 Refresh states manually
   */
  refreshStates(): Observable<StateResponse[]> {
    this.invalidateCache();
    return this.getAllStates();
  }

  /**
   * 🔥 Check if state exists
   */
  checkStateExists(stateName: string): Observable<boolean> {
    return this.http.get<apiResponseDto<boolean>>(`${this.baseUrl}/exists/${encodeURIComponent(stateName)}`, this.httpOptions)
      .pipe(
        map(response => response.status ? response.data || false : false),
        catchError(() => of(false))
      );
  }
}