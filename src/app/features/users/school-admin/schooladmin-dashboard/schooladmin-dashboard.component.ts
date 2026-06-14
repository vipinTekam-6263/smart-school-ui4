import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { AuthService } from 'app/core/services/auth.service';
import { AdminDashboardService } from '../services/admin-dashboard.service';
import { SchoolDashboardStats } from 'app/models/auth/response/SchoolDash-response.dto';

@Component({
  selector: 'app-schooladmin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './schooladmin-dashboard.component.html',
  styleUrls: ['./schooladmin-dashboard.component.css']
})
export class SchooladminDashboardComponent implements OnInit {

  // ================= DASHBOARD ONLY =================
  schooldashboardstats: SchoolDashboardStats = {
    totalStudents: 0,
    totalTeachers: 0,
    totalAttendanceToday: 0,
    presentToday: 0,
    absentToday: 0,
    pendingHomework: 0,
    activeNotices: 0
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private adminDashboardService: AdminDashboardService
  ) {}

  ngOnInit(): void {
    if (!this.authService.isTokenExpired()) {
      this.loadDashboardData();
    } else {
      this.authService.logout();
      this.router.navigate(['/']);
    }
  }

  // ================= DASHBOARD DATA =================
  loadDashboardData(): void {
    this.adminDashboardService.getAdminDashboard().subscribe({
      next: (stats) => this.schooldashboardstats = stats,
      error: (err) => console.error(err)
    });
  }

  // ================= NAV =================
  goToStudents(): void {
    this.router.navigate(['/students']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
  goToTeachers(): void {
      console.log("TEACHER CLICKED");
      alert("CLICK WORKING");
  console.log("TEACHER CLICKED");
  this.router.navigate(['/teachers']);
}
goToClasses(): void {
  console.log("CLASS CLICKED");
  this.router.navigate(['/classes']);
}
goToAttendance():void{
  console.log("ATTENDANCE CLICK");
  this.router.navigate(['/attendance']);
}
goToHomework() {
  this.router.navigate(['/school-admin/homework']);
}

openNotice() {
  this.router.navigate(['/school-admin/notice']);
}
goToExam()
{
  this.router.navigate(['/school-admin/Exam'])
}

goToTeacherAssign(): void {
  console.log("TEACHER ASSIGN CLICK");
  this.router.navigate(['/school-admin/teacher-class-assign']);
}
}