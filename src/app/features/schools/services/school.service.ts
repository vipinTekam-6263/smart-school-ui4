import { Injectable } from '@angular/core';
import { 
  HttpClient, 
  HttpErrorResponse, 
  HttpStatusCode 
} from '@angular/common/http';
import { 
  BehaviorSubject, 
  catchError, 
  finalize, 
  Observable, 
  of, 
  retry, 
  shareReplay,
  switchMap,
  tap,
  throwError 
} from 'rxjs';
import { map } from 'rxjs/operators';
import { SchoolCreateRequest } from 'app/models/auth/request/school-request.dto';
import { SchoolUpdateRequest } from 'app/models/auth/request/school-udpate-request.dto';
import { SchoolResponse } from 'app/models/auth/response/school-response.dto';
import { PageResponse } from 'app/models/auth/response/pagination-response.dto';
import { apiResponseDto } from 'app/models/auth/response/api-response.dto';
import { environment } from '@env/environment';

export interface SchoolListResponse {
  content: SchoolResponse[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
}

@Injectable({
  providedIn: 'root'
})
export class SchoolService {
  private baseUrl = `${environment.apiBaseUrl}/schools`;
  
  // Cache for school by ID
  private schoolCache = new Map<number, Observable<apiResponseDto<SchoolResponse>>>();
  
  // Loading states
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  // ================= CREATE =================
  createSchool(req: SchoolCreateRequest): Observable<apiResponseDto<number>> {
    return this.http.post<apiResponseDto<number>>(this.baseUrl, req)
      .pipe(
        this.handleRequest(),
        catchError(this.handleError),
        tap(() => this.clearCache()) // Clear cache on create
      );
  }

  // ================= UPDATE =================
  updateSchool(id: number, req: SchoolUpdateRequest): Observable<apiResponseDto<void>> {
    return this.http.put<apiResponseDto<void>>(`${this.baseUrl}/${id}`, req)
      .pipe(
        this.handleRequest(),
        catchError(this.handleError),
        tap(() => this.clearCache(id)) // Clear specific cache
      );
  }

  // ================= DELETE =================
  deleteSchool(id: number): Observable<apiResponseDto<void>> {
    return this.http.delete<apiResponseDto<void>>(`${this.baseUrl}/${id}`)
      .pipe(
        this.handleRequest(),
        catchError(this.handleError),
        tap(() => this.clearCache(id))
      );
  }

  // ================= GET BY ID (CACHED) =================
  getSchoolById(id: number): Observable<apiResponseDto<SchoolResponse>> {
    // Return cached observable if exists
    if (this.schoolCache.has(id)) {
      return this.schoolCache.get(id)!;
    }

    const request = this.http.get<apiResponseDto<SchoolResponse>>(`${this.baseUrl}/${id}`)
      .pipe(
        this.handleRequest(),
        shareReplay(1), // Cache the result
        catchError(this.handleError)
      );

    // Store in cache
    this.schoolCache.set(id, request);
    return request;
  }

  // ================= GET BY DISTRICT (PAGINATED) =================
  getSchoolsByDistrict(
    districtId: number, 
    page: number = 0, 
    size: number = 10
  ): Observable<apiResponseDto<SchoolListResponse>> {
    const params = { page, size };
    
    return this.http.post<apiResponseDto<SchoolListResponse>>(
      `${this.baseUrl}/district/${districtId}/page`,
      { page, size }
    ).pipe(
      this.handleRequest(),
      catchError(this.handleError)
    );
  }

  // ================= UTILITY METHODS =================
  clearCache(specificId?: number): void {
    if (specificId) {
      this.schoolCache.delete(specificId);
    } else {
      this.schoolCache.clear();
    }
  }

  invalidateCache(): void {
    this.clearCache();
  }

  // ================= REQUEST/RESPONSE HANDLERS =================
  private handleRequest() {
    return (source$: Observable<any>) => {
      this.loadingSubject.next(true);
      return source$.pipe(
        retry(2), // Retry failed requests 2 times
        finalize(() => this.loadingSubject.next(false))
      );
    };
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Something went wrong!';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message || 'Client error occurred';
    } else {
      // Server-side error
      switch (error.status) {
        case HttpStatusCode.Unauthorized:
          errorMessage = 'Authentication failed. Please login again.';
          break;
        case HttpStatusCode.Forbidden:
          errorMessage = 'Access denied. Insufficient permissions.';
          break;
        case HttpStatusCode.NotFound:
          errorMessage = 'Resource not found.';
          break;
        case HttpStatusCode.BadRequest:
          errorMessage = error.error?.message || 'Invalid request data.';
          break;
        case HttpStatusCode.InternalServerError:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          errorMessage = error.error?.message || `Server error: ${error.status}`;
      }
    }

    console.error('SchoolService Error:', {
      status: error.status,
      message: errorMessage,
      url: error.url,
      error: error.error
    });

    return throwError(() => new Error(errorMessage));
  }

  getAllSchools(page: number, size: number) {
  return this.http.get<any>(`${this.baseUrl}?page=${page}&size=${size}`);
}
}