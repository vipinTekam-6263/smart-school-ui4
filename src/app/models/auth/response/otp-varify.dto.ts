export interface VerifyOtpRequestDto {
  username: string;  // User email ya mobile
  otp: string;       // OTP entered by user
  otpType: string;   // Example: "LOGIN", "RESET_PASSWORD" etc.
}