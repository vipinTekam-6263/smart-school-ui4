import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    const token = localStorage.getItem('token');

    // 🔥 SAFE ROLE READ (ONLY ONE SOURCE)
    const role = localStorage.getItem('role');

    console.log("🔥 Guard Check => Token:", token, "Role:", role);

    // ❌ TOKEN CHECK
    if (!token) {
      console.warn("❌ No token found");
      this.clearAndRedirect();
      return false;
    }

    // ❌ TOKEN EXPIRY CHECK (SAFE CALL)
    if (this.authService.isTokenExpired()) {
      console.warn("❌ Token expired");
      this.clearAndRedirect();
      return false;
    }

    const allowedRoles = route.data['roles'] as Array<string>;

    console.log("👤 User Role:", role);
    console.log("🎯 Allowed Roles:", allowedRoles);

    // ❌ ROLE CHECK
    if (allowedRoles && allowedRoles.length > 0) {

      if (!role) {
        console.warn("❌ Role missing in storage");
        this.clearAndRedirect();
        return false;
      }

      if (!allowedRoles.includes(role)) {
        console.warn("❌ Access denied for role:", role);
        this.clearAndRedirect();
        return false;
      }
    }

    return true;
  }

  private clearAndRedirect(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');

    this.router.navigate(['/']);
  }
}