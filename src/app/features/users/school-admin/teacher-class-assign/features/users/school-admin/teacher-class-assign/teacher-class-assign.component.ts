import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { TeacherClassService } from 'app/features/users/school-admin/services/TeacherClass-Assign-Service';
import { TeacherClassAssignRequestDto } from 'app/models/auth/request/teacher-class-assign-request.dto';
import { MessageService } from 'app/shared/message.service';
import { MasterDataService } from 'app/features/users/school-admin/services/MasterDataService';
@Component({
  selector: 'app-teacher-class-assign',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher-class-assign.component.html',
  styleUrls: ['./teacher-class-assign.component.css']
})
export class TeacherClassAssignComponent implements OnInit {

  // ================= FORM =================
  form: TeacherClassAssignRequestDto = {
    teacherId: 0,
    classId: 0,
    schoolId: 0,
    sectionId: 0,
    subject: '',
    academicYearId: 0
  };

  loading = false;

  // ================= DROPDOWNS =================
  teachers: any[] = [];
  classes: any[] = [];
  sections: any[] = [];
  academicYears: any[] = [];

  constructor(
    private service: TeacherClassService,
    private http: HttpClient,
     private masterdataService:MasterDataService,
    private msg: MessageService
  ) {}

  ngOnInit(): void {
      this.loadDropdowns();
  }

  // ================= LOAD DROPDOWNS =================
  loadDropdowns() {

  const schoolId = 1; // later from login token

  this.masterdataService.getTeacherAssignData(schoolId).subscribe({
    next: (res) => {

      console.log("MASTER DATA RESPONSE:", res);

      this.teachers = res.teachers || [];
      this.classes = res.classes || [];
      this.sections = res.sections || [];
      this.academicYears = res.academicYears || [];
    },
    error: (err) => {
      console.error("MASTER DATA ERROR:", err);
      this.msg.showError('Master data load failed');
    }
  });
}
  // ================= ASSIGN =================
  assignTeacher() {

    this.loading = true;

    console.log("FORM DATA:", this.form);

    this.service.assignTeacher(this.form).subscribe({
      next: (res) => {

        console.log("ASSIGN RESPONSE:", res);

        this.msg.showSuccess(res.message || 'Teacher assigned successfully');

        this.resetForm();
        this.loading = false;
      },
      error: (err) => {

        console.error("ASSIGN ERROR:", err);

        this.msg.showError(err?.error?.message || 'Assignment failed');

        this.loading = false;
      }
    });
  }

  // ================= RESET =================
  resetForm() {
    this.form = {
      teacherId: 0,
      classId: 0,
      schoolId: 0,
      sectionId: 0,
      subject: '',
      academicYearId: 0
    };
  }
}