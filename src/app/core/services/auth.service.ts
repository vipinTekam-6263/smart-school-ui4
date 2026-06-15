import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { LoginRequestDto } from '../../models/auth/request/login-request.dto';
import { OtpRequestDto } from '../../models/auth/request/otp-request.dto';
import { VerifyOtpRequestDto } from '../../models/auth/request/varify-otp-request.dto';

import { apiResponseDto } from '../../models/auth/response/api-response.dto';
import { LoginResponseDto } from '../../models/auth/response/login-response.dto';
import { otpResponseDto } from '../../models/auth/response/otp-response.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8080/api';
  private otpUrl = `${this.baseUrl}/otp`;



  
  constructor(private http: HttpClient) {}

  // 🔹 LOGIN (NO STORAGE HERE)
  login(data: LoginRequestDto): Observable<apiResponseDto<LoginResponseDto>> {
    return this.http.post<apiResponseDto<LoginResponseDto>>(
      `${this.baseUrl}/auth/login`,
      data
    );
  }

  // 🔹 SEND OTP
  sendOtp(data: OtpRequestDto): Observable<apiResponseDto<otpResponseDto>> {
    const params = new HttpParams()
      .set('username', data.username)
      .set('otpType', data.otpType);

    return this.http.post<apiResponseDto<otpResponseDto>>(
      `${this.otpUrl}/send`,
      {},
      { params }
    );
  }

  // 🔹 VERIFY OTP (ONLY API CALL)
  verifyOtp(data: VerifyOtpRequestDto): Observable<apiResponseDto<LoginResponseDto>> {
    return this.http.post<apiResponseDto<LoginResponseDto>>(
      `${this.baseUrl}/auth/verify-otp`,
      data
    );
  }

  // 🔹 ROLE HELP
  getRole(): string | null {
    return localStorage.getItem('role');
  }

  // 🔹 LOGOUT
  logout(): void {
    localStorage.clear();
  }

  // 🔹 TOKEN EXPIRE CHECK
  isTokenExpired(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() > payload.exp * 1000;
    } catch {
      return true;
    }
  }

setSchoolId(id: number) {
  localStorage.setItem('schoolId', id.toString());
}

getSchoolId(): number | null {
  const id = localStorage.getItem('schoolId');
  return id ? Number(id) : null;
}

clearSchoolId() {
  localStorage.removeItem('schoolId');
}


  //  FORGOT PASSWORD (SEND OTP)
  forgotPassword(username: string): Observable<apiResponseDto<void>> {
    return this.http.post<apiResponseDto<void>>(
      `${this.baseUrl}/auth/forgot-password`,
      {},
      {
        params: new HttpParams().set('username', username)
      }
    );
  }

  //  VERIFY FORGOT PASSWORD OTP
  verifyForgotPasswordOtp(data: VerifyOtpRequestDto): Observable<apiResponseDto<any>> {
    return this.http.post<apiResponseDto<any>>(
      `${this.baseUrl}/auth/verify-forgot-password-otp`,
      data
    );
  }

  //  RESET PASSWORD
 resetPassword(
  username: string,
  otp: string,
  newPassword: string
): Observable<apiResponseDto<void>> {
  return this.http.post<apiResponseDto<void>>(
    `${this.baseUrl}/auth/reset-password`,
    {},
    {
      params: new HttpParams()
        .set('username', username)
        .set('otp', otp)
        .set('newPassword', newPassword)
    }
  );
}

verifyForgotOtp(username: string, otp: string): Observable<any> {
  const params = new HttpParams()
    .set('username', username)
    .set('otp', otp);

  return this.http.post(`${this.baseUrl}/auth/verify-forgot-password-otp`, {}, { params });
}
}