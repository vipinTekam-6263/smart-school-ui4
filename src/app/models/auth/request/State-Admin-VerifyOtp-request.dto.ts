// src/app/models/auth/request/state-admin-verify-otp-request.dto.ts
export interface StateAdminVerifyOtpRequest {
  email: string;
  otp: string; // 6 digits, validation Angular me component/form me handle karenge
}