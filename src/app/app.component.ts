import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';  // 👈 ADD THIS
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule],
  template: `<router-outlet></router-outlet>`,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'smart-school-ui4';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {

    // 🔥 SAFE TOKEN CHECK
    const token = localStorage.getItem('token');

    if (token && this.authService.isTokenExpired?.()) {
      console.warn("❌ Token expired on app load");
      localStorage.clear();
      this.router.navigate(['/']);
    }

    // 🔥 DEBUG ROUTE TRACKING (IMPORTANT)
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        console.log("🚀 NAVIGATED TO:", event.url);
      }
    });
  }
}