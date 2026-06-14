export class ResourceNotFoundException extends Error {
  constructor(message?: string) {
    super(message || 'Resource not found.');
    this.name = 'ResourceNotFoundException';
  }
}