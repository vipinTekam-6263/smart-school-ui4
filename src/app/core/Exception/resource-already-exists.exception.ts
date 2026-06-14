export class ResourceAlreadyExistsException extends Error {
  constructor(message?: string) {
    super(message || 'Resource already exists.');
    this.name = 'ResourceAlreadyExistsException';
  }
}
