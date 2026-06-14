import { Component, OnInit } from '@angular/core';
import { TeacherDashboardResponseDto } from 'app/models/auth/response/TeacherDashboardResponseDto';
import { HomeworkDto } from 'app/models/auth/response/HomeworkDto';
import { NoticeResponse } from 'app/models/auth/response/Notice-Response.dto';
import { AttendanceResponseDto } from 'app/models/auth/response/AttendanceResponseDto';
import { TeacherDashboardService } from '../service/teacher.service';
import { AttendanceRequestDto } from 'app/models/auth/request/AttendanceRequestDto';
import { CommonModule } from '@angular/common';
import { AuthService } from 'app/core/services/auth.service';
import { Router } from '@angular/router';
import { HomeworkService } from '../../parent-dashboard/service/homeworkService';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.css']
})
export class TeacherDashboardComponent implements OnInit {

  dashboardData!: TeacherDashboardResponseDto;

  homeworkList: HomeworkDto[] = [];
  noticeList: NoticeResponse[] = [];
  attendanceList: AttendanceResponseDto[] = [];

  loading = false;

  // ================= FIXED STATE =================
  selectedDate: string = this.getTodayDate();
  selectedSectionId!: number;
  selectedStudentId!: number;

  constructor(
    private dashboardService: TeacherDashboardService,
    private homeworkService: HomeworkService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
    this.loadHomework();
  }

  // ================= DASHBOARD =================
  loadDashboard(): void {
    this.loading = true;

    this.dashboardService.getTeacherDashboard().subscribe({
      next: (res: any) => {

        this.dashboardData = res;

        this.noticeList = res.noticeList ?? [];
        this.attendanceList = res.attendanceList ?? [];

        // 🔥 IMPORTANT: set default IDs from first record (if available)
        if (this.attendanceList.length > 0) {
          this.selectedSectionId = (this.attendanceList[0] as any).sectionId;
          this.selectedStudentId = (this.attendanceList[0] as any).studentId;
        }

        this.loading = false;
      },

      error: (err) => {
        console.error("Dashboard error:", err);
        this.loading = false;
      }
    });
  }

  // ================= HOMEWORK =================
  loadHomework(): void {
    this.homeworkService.getTeacherHomework().subscribe({
      next: (res) => {
        this.homeworkList = res ?? [];
      },
      error: (err) => {
        console.error("Homework error:", err);
      }
    });
  }

  // ================= ATTENDANCE =================
  markAttendance(studentClassId: number, status: 'PRESENT' | 'ABSENT'): void {

    const payload: AttendanceRequestDto = {
      studentClassId: studentClassId,
      studentId: this.selectedStudentId,
      sectionId: this.selectedSectionId,
      attendanceDate: this.selectedDate,
      status: status,
      remarks: ''
    };

    this.dashboardService.markAttendance(payload).subscribe({
      next: () => {
        console.log('Attendance marked');
        this.loadDashboard();
      },
      error: (err) => {
        console.error('Attendance error:', err);
      }
    });
  }

  // ================= HELPERS =================
  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  openAttendance() {
    this.router.navigate(['/teacher-attendance']);
  }

  openHomework() {}
  openNotices() {}

  logout() {
    if (confirm("Are you sure you want to logout?")) {
      this.authService.logout();
      this.router.navigate(['/']);
    }
  }

  goToHomeworkPage() {
    this.router.navigate(['/homework-list']);
  }
}