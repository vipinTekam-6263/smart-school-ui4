export class UsernameNotFoundException extends Error {
  constructor(message?: string) {
    super(message || 'Username not found.');
    this.name = 'UsernameNotFoundException';
  }
}