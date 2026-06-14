import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StateAdminService } from '../services/state-admin.service';
import { NotificationComponent } from '../../../../shared/components/notification/notification.component';

@Component({
  selector: 'app-stateadmin-dashboard',
  standalone: true,
  imports: [CommonModule, NotificationComponent],
  templateUrl: './stateadmin-dashboard.component.html',
  styleUrl: './stateadmin-dashboard.component.css'
})
export class StateadminDashboardComponent implements OnInit {

  dashboardNotifications = [
    'New district added',
    'New school registered',
    'Revenue updated',
    'User activity increased'
  ];

  constructor(
    private stateAdminService: StateAdminService,
    private router: Router
  ) {}

  // 🔷 Dynamic Data (initial 0)
  totalDistrict = 0;
  totalSchool = 0;
  totalTeacher = 0;
  totalStudent = 0;
  activeDistrict = 0;
  inactiveDistrict = 0;

  ngOnInit(): void {
    this.loadDashboardData();
  }

  // ✅ 🔥 MAIN FIX (API CALL)
  loadDashboardData() {
    this.stateAdminService.getDashboardCounts().subscribe({
      next: (res: any) => {
        console.log("Dashboard API Response =>", res);

        // 👇 backend DTO ke according set karo
        this.totalDistrict = res.totalDistrict || 0;
        this.totalSchool = res.totalSchool || 0;

        // future ke liye
        this.totalTeacher = res.totalTeacher || 0;
        this.totalStudent = res.totalStudent || 0;

        this.activeDistrict = res.activeDistrict || 0;
        this.inactiveDistrict = res.inactiveDistrict || 0;
      },
      error: (err:any) => {
        console.error("Dashboard API Error", err);
      }
    });
  }

  // 🔷 Navigation
  goToDistrictList() {
    this.router.navigate(['/district-management']);
  }

  goToSchoolList() {
    this.router.navigate(['/school-management']);
  }

  goToTeacherList() {
    this.router.navigate(['/teacher-management']);
  }

  goToStudentList() {
    this.router.navigate(['/student-management']);
  }

  goToActiveDistricts() {
    this.router.navigate(['/district-management'], {
      queryParams: { status: 'active' }
    });
  }

  goToInactiveDistricts() {
    this.router.navigate(['/district-management'], {
      queryParams: { status: 'inactive' }
    });
  }

  
  logout() {
  // 1. Clear authentication data
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.clear();

  // 2. Optional: clear any interval if needed (safe cleanup)
  // (future me agar interval reference store karo to yaha clear karna)

  // 3. Redirect to login page
  this.router.navigate(['/login']);
}
}