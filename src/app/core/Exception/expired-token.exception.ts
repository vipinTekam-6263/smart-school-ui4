export class ExpiredTokenException extends Error {
  constructor(message?: string) {
    super(message || 'Token has expired.');
    this.name = 'ExpiredTokenException';
  }
}