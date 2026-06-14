import { Component, OnInit } from '@angular/core';
import { forkJoin, finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeacherDashboardService } from '../../service/teacher.service';
import { AttendanceRequestDto } from 'app/models/auth/request/AttendanceRequestDto';
import { AttendanceResponseDto } from 'app/models/auth/response/AttendanceResponseDto';
import { apiResponseDto } from 'app/models/auth/response/api-response.dto';
import { Location } from '@angular/common';
@Component({
  selector: 'app-teacher-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher-attendance.component.html',
  styleUrls: ['./teacher-attendance.component.css']
})
export class TeacherAttendanceComponent implements OnInit {

  selectedSectionId: number = 1;
  selectedDate: string = '';

  students: AttendanceResponseDto[] = [];
  attendanceList: AttendanceRequestDto[] = [];

  loading = false;
  submitting = false;
  submitted = false;
  errorMessage = '';

  role: string = '';

  private attendanceInterval: any;
private isPollingActive = false;

private isRequestInProgress = false;

  constructor(private teacherService: TeacherDashboardService,
      private location: Location   // 👈 add this
  ) {}

  ngOnInit(): void {
    this.role = localStorage.getItem('role') || '';
    this.selectedDate = new Date().toISOString().split('T')[0];

     // initial load
  this.loadAttendance();

  // start auto refresh
  this.startPolling();
  }

  // ================= LOAD =================
 loadAttendance() {

  console.log("SECTION ID:", this.selectedSectionId);
console.log("DATE:", this.selectedDate);

  if (this.isRequestInProgress) {
    return;
  }

  if (!this.selectedSectionId || !this.selectedDate) {
    this.showError('Please select both section and date');
    return;
  }

  this.isRequestInProgress = true;
  this.loading = true;

  this.teacherService
    .getSectionAttendance(this.selectedSectionId, this.selectedDate)
    .pipe(
      finalize(() => {

        // 🔥 smooth loading stop (no blink fix)
        setTimeout(() => {
          this.loading = false;
        }, 1000);

        this.isRequestInProgress = false;
      })
    )
    .subscribe({
      next: (res: any) => {

        const data = res?.data || [];

        console.log("API DATA:", data);
        console.log("API RESPONSE FULL:", res);   // 🔥 add this
  console.log("API DATA:", data);           // 🔥 add this


        // UI LIST
        this.students = data;

        // REQUEST STATE LIST
        this.attendanceList = data.map((s: any) => ({
          studentClassId: s.studentClassId,
          studentId: s.student?.id ?? s.studentId ?? 0,
          sectionId: this.selectedSectionId,
          attendanceDate: this.selectedDate,
          status: s.status || 'PRESENT',
          remarks: s.remarks || ''
        }));

        this.submitted = false;
      },

      error: (err) => {

        console.log("FULL ERROR:", err);

        const msg =
          err?.error?.message ||
          err?.error?.details ||
          err?.message ||
          'Request failed';

        this.showError(msg);
      }
    });
}
  // ================= UPDATE STATUS =================
  updateStatus(studentClassId: number, status: 'PRESENT' | 'ABSENT') {

    const record = this.attendanceList.find(
      a => a.studentClassId === studentClassId
    );

    if (record) {
      record.status = status;
    }
  }

  // ================= SUBMIT =================
 submitAttendance() {

  if (this.role !== 'TEACHER') {
    this.showError('Only teachers can mark attendance');
    return;
  }

  if (!this.attendanceList.length) {
    this.showError('No data found');
    return;
  }

  this.submitting = true;
  this.errorMessage = '';

  let successCount = 0;
  let errorCount = 0;

  this.attendanceList.forEach(a => {

    const payload: AttendanceRequestDto = {
      studentClassId: Number(a.studentClassId || 0),
      studentId: Number(a.studentId || 0),
      sectionId: Number(a.sectionId || this.selectedSectionId),
      attendanceDate: this.selectedDate, // YYYY-MM-DD safe
      status: a.status,
      remarks: a.remarks || ''
    };

    console.log("📤 SENDING PAYLOAD:", payload); // 🔥 DEBUG

    this.teacherService.markAttendance(payload).subscribe({

      next: (res: any) => {

        console.log("✅ SUCCESS RESPONSE:", res);

        successCount++;

        this.showSuccess(res?.message || 'Attendance marked successfully');

        this.checkCompletion(successCount, errorCount);
      },

      error: (err) => {

        console.log("❌ ATTENDANCE ERROR FULL:", err);
        console.log("❌ BACKEND RESPONSE:", err?.error);

        errorCount++;

        const msg =
          err?.error?.message ||
          err?.error?.details ||
          JSON.stringify(err?.error) ||
          'Failed to mark attendance';

        this.showError(msg);

        this.checkCompletion(successCount, errorCount);
      }
    });

  });
}


private checkCompletion(success: number, error: number) {

  if (success + error === this.attendanceList.length) {
    this.submitting = false;
    this.submitted = success > 0;
  }
}
  // ================= RESET =================
  resetForm() {
    this.students = [];
    this.attendanceList = [];
    this.submitted = false;
  }

  // ================= HELPERS =================
  private showError(msg: string) {
    this.errorMessage = msg;
    setTimeout(() => this.errorMessage = '', 4000);
  }

  private showSuccess(msg: string) {
    alert(msg);
  }

  get hasData(): boolean {
    return this.attendanceList.length > 0;
  }

  get isTeacher(): boolean {
    return this.role === 'TEACHER';
  }

  getStatus(studentClassId: number): 'PRESENT' | 'ABSENT' | undefined {
    return this.attendanceList.find(
      a => a.studentClassId === studentClassId
    )?.status;
  }


  startPolling() {
  if (this.isPollingActive) return;

  this.isPollingActive = true;

  this.attendanceInterval = setInterval(() => {
    console.log("🔄 Auto refreshing attendance...");
    this.loadAttendance();
  }, 20000); // 3 seconds
}

stopPolling() {
  if (this.attendanceInterval) {
    clearInterval(this.attendanceInterval);
    this.attendanceInterval = null;
  }

  this.isPollingActive = false;
}

ngOnDestroy(): void {
  this.stopPolling();
}

goBack() {
  this.location.back();
}
}