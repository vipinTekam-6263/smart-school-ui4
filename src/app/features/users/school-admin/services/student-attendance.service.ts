import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AttendanceRequestDto } from 'app/models/auth/request/AttendanceRequestDto';
import { AttendanceResponseDto } from 'app/models/auth/response/AttendanceResponseDto';
import { apiResponseDto } from 'app/models/auth/response/api-response.dto';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private baseUrl = 'http://localhost:8080/api/attendance';

  constructor(private http: HttpClient) {}

  // ================= MARK ATTENDANCE =================
  markAttendance(payload: AttendanceRequestDto): Observable<apiResponseDto<number>> {
    return this.http.post<apiResponseDto<number>>(
      this.baseUrl,
      payload
    );
  }

  // ================= UPDATE ATTENDANCE =================
  updateAttendance(id: number, payload: AttendanceRequestDto): Observable<apiResponseDto<void>> {
    return this.http.put<apiResponseDto<void>>(
      `${this.baseUrl}/${id}`,
      payload
    );
  }

  // ================= DELETE ATTENDANCE =================
  deleteAttendance(id: number): Observable<apiResponseDto<void>> {
    return this.http.delete<apiResponseDto<void>>(
      `${this.baseUrl}/${id}`
    );
  }

  // ================= SECTION ATTENDANCE =================
  getSectionAttendance(sectionId: number, date: string): Observable<apiResponseDto<AttendanceResponseDto[]>> {

    const params = new HttpParams()
      .set('sectionId', sectionId)
      .set('date', date);

    return this.http.get<apiResponseDto<AttendanceResponseDto[]>>(
      `${this.baseUrl}/section`,
      { params }
    );
  }

  // ================= MONTHLY REPORT =================
  getMonthlyAttendance(
    studentClassId: number,
    year: number,
    month: number
  ): Observable<apiResponseDto<AttendanceResponseDto[]>> {

    const params = new HttpParams()
      .set('studentClassId', studentClassId)
      .set('year', year)
      .set('month', month);

    return this.http.get<apiResponseDto<AttendanceResponseDto[]>>(
      `${this.baseUrl}/monthly`,
      { params }
    );
  }

  // ================= BULK MARK =================
  markBulkAttendance(payload: AttendanceRequestDto[]): Observable<apiResponseDto<void>> {
    return this.http.post<apiResponseDto<void>>(
      `${this.baseUrl}/bulk`,
      payload
    );
  }
}