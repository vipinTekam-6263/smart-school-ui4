import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DistrictAdminService } from '../services/district-admin.service';
import { NotificationComponent } from '../../../../shared/components/notification/notification.component';

// Import individual exceptions for component-level handling
import { ExpiredTokenException } from '../../../../core/Exception/expired-token.exception';
import { InvalidOtpException } from '../../../../core/Exception/invalid-otp.exception';
import { InvalidResourceException } from '../../../../core/Exception/invalid-resource.exception';
import { ResourceAlreadyExistsException } from '../../../../core/Exception/resource-already-exists.exception';
import { ResourceNotFoundException } from '../../../../core/Exception/resource-not-found.exception';
import { UsernameNotFoundException } from '../../../../core/Exception/username-not-found.exception';

@Component({
  selector: 'app-districtadmin-dashboard',
  standalone: true,
  imports: [CommonModule, NotificationComponent],
  templateUrl: './districtadmin-dashboard.component.html',
  styleUrls: ['./districtadmin-dashboard.component.css']
})
export class DistrictadminDashboardComponent implements OnInit {
  
    dashboardNotifications = [
    'New district added',
    'New school registered',
    'Revenue updated',
    'User activity increased'
  ];

  district = { id: 0, name: '' };
  userName = 'District Admin';
  userEmail = 'district1@admin.com';
  userInitials = 'DA';

  totalSchools = 0;
  activeSchools = 0;
  monthlyRevenue = 0;
  appUsage = 0;

  activeMenu = 'dashboard';
  isLoading = true;

  constructor(
    private dashboardService: DistrictAdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('DistrictadminDashboardComponent initialized');
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;

    this.dashboardService.getDashboardStats(this.district.id).subscribe({
      next: (data:any) => {
        // Assign data safely
        this.totalSchools = data.totalSchools ?? 1247;
        this.activeSchools = data.activeSchools ?? 1156;
        this.monthlyRevenue = data.monthlyRevenue ?? 4.2;
        this.appUsage = data.appUsage ?? 28.4;
        this.isLoading = false;
      },
      error: (err:any) => {
        this.isLoading = false;

        // Custom exception handling
        if (err instanceof ExpiredTokenException) {
          alert('Session expired. Please login again.');
          this.router.navigate(['/login']);
        } else if (err instanceof InvalidOtpException) {
          alert('Invalid OTP. Please try again.');
        } else if (err instanceof InvalidResourceException) {
          alert('Invalid resource access!');
        } else if (err instanceof ResourceAlreadyExistsException) {
          alert('Resource already exists!');
        } else if (err instanceof ResourceNotFoundException) {
          alert('Resource not found!');
        } else if (err instanceof UsernameNotFoundException) {
          alert('Username not found!');
        } else {
          console.error('Unknown error:', err);
          alert('Something went wrong! Please try again.');
        }
      }
    });
  }

  setActiveMenu(menu: string): void {
    this.activeMenu = menu;
  }

  toggleSidebar(): void {
    document.getElementById('sidebar')?.classList.toggle('active');
  }

  viewSchools(): void {
    console.log('Navigating to schools for district:', this.district);
  }

  viewReports(): void {
    console.log('Navigating to reports for district:', this.district);
  }

  supportRequest(): void {
    console.log('Opening support for district:', this.district);
  }

  deleteDistrict(): void {
    if (confirm(`Delete district ${this.district.name}?`)) {
      this.dashboardService.deleteDistrictAdmin(this.district.id).subscribe({
        next: () => {
          alert('District deleted successfully!');
          this.router.navigate(['/districts']);
        },
        error: (err:any) => {
          // Component-level exception handling
          if (err instanceof ExpiredTokenException) {
            alert('Session expired. Please login again.');
            this.router.navigate(['/login']);
          } else {
            console.error('Error deleting district:', err);
            alert('Error deleting district!');
          }
        }
      });
    }
  }

  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.clear();
      this.router.navigate(['/login']);
    }
  }

  refreshData(): void {
    this.loadDashboardData();
  }
}