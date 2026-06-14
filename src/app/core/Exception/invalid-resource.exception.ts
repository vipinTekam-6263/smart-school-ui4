export class InvalidResourceException extends Error {
  constructor(message?: string) {
    super(message || 'Invalid resource.');
    this.name = 'InvalidResourceException';
  }
}