export class InvalidOtpException extends Error {
  constructor(message?: string) {
    super(message || 'Invalid OTP provided.');
    this.name = 'InvalidOtpException';
  }
}