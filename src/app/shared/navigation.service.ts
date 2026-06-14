import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(
    private location: Location,
    private router: Router
  ) {}

  // 🔙 Go back to previous page
  goBack(): void {
    this.location.back();
  }

  // 🔀 Go to specific route (optional but useful)
  goTo(route: string): void {
    this.router.navigate([route]);
  }

  // 🔄 Refresh current page (optional)
  reload(): void {
    this.router.navigateByUrl(this.router.url);
  }
}