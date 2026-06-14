import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from 'app/shared/message.service';

import { TeacherService } from '../teacherService';
import { TeacherResponse } from 'app/models/auth/response/teacherResponse';
import { TeacherStatus } from 'app/models/enums/TeacherStatus';
import { TeacherVerifyOtpRequest } from 'app/models/auth/request/TeacherVerifyOtpRequest';
import { NavigationService } from 'app/shared/navigation.service';
@Component({
  selector: 'app-teacher-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.css']
})
export class TeacherListComponent implements OnInit {

  teachers: TeacherResponse[] = [];

  teacherForm!: FormGroup;
  otpForm!: FormGroup;

  selectedTeacherId: number | null = null;

  isLoading = false;
  isSubmitting = false;

  sentEmail = '';

  TeacherStatus = TeacherStatus;

  viewMode: 'LIST' | 'ADD' | 'OTP' = 'LIST';


  errorMessage: string = '';
successMessage: string = '';
  constructor(
    private teacherService: TeacherService,
    private fb: FormBuilder,
    private navigationService:NavigationService,
    private messageService: MessageService
  ) {
    this.initForms();
  }

  ngOnInit(): void {
    this.getAllTeachers();
  }

  // ================= FORMS =================
  private initForms(): void {

    this.teacherForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      designation: ['', Validators.required],
      qualification: ['', Validators.required],
      subject: ['', Validators.required],
      schoolId: [0, Validators.required]
    });

    this.otpForm = this.fb.group({
      otp: ['', Validators.required],
      designation: ['', Validators.required],
      qualification: ['', Validators.required],
      subject: ['', Validators.required]
    });
  }

  // ================= GET ALL =================
  getAllTeachers(): void {
    this.isLoading = true;

    this.teacherService.getAllTeachers(0, 10).subscribe({
      next: (res) => {
        this.teachers = res.content;
        this.isLoading = false;
      },
      error: () => {
        this.messageService.showError('Failed to fetch teachers');
        this.isLoading = false;
      }
    });
  }

  // ================= REGISTER =================
  registerTeacher(): void {

    if (this.teacherForm.invalid) {
      this.teacherForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    this.teacherService.registerTeacher(this.teacherForm.value).subscribe({
      next: () => {
        this.messageService.showSuccess('OTP sent successfully');

        this.sentEmail = this.teacherForm.value.email;
        this.viewMode = 'OTP';

        this.isSubmitting = false;
      },
      error: () => {
        this.messageService.showError('Registration failed');
        this.isSubmitting = false;
      }
    });
  }

  // ================= VERIFY OTP =================
  verifyOtp(): void {

    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }

    const data: TeacherVerifyOtpRequest = {
      ...this.otpForm.value,
      email: this.sentEmail
    };

    this.teacherService.verifyTeacher(data).subscribe({
      next: () => {
        this.messageService.showSuccess('Teacher verified successfully');

        this.viewMode = 'LIST';
        this.getAllTeachers();
        this.resetForms();
      },
      error: () => {
        this.messageService.showError('OTP verification failed');
      }
    });
  }

  // ================= EDIT =================
  editTeacher(teacher: TeacherResponse): void {

    this.viewMode = 'ADD';
    this.selectedTeacherId = teacher.id;

    this.teacherForm.patchValue({
      name: teacher.name,
      email: teacher.email,
      mobile: teacher.mobile,
      designation: teacher.designation,
      qualification: teacher.qualification,
      subject: teacher.subject,
      schoolId: teacher.schoolId,
      password: ''
    });
  }

  // ================= DELETE =================
  deleteTeacher(id: number): void {

    if (!confirm('Are you sure?')) return;

    this.teacherService.deleteTeacher(id).subscribe({
      next: () => {
        this.messageService.showSuccess('Deleted successfully');
        this.getAllTeachers();
      },
      error: () => {
        this.messageService.showError('Delete failed');
      }
    });
  }

  // ================= STATUS TOGGLE =================
  toggleStatus(teacher: TeacherResponse): void {

    this.teacherService.updateTeacherStatus(teacher.id)
      .subscribe({
        next: () => {
          this.messageService.showSuccess('Status updated successfully');
          this.getAllTeachers();
        },
        error: () => {
          this.messageService.showError('Status update failed');
        }
      });
  }

  // ================= UPDATE =================
  updateTeacher(): void {

    if (this.teacherForm.invalid || !this.selectedTeacherId) return;

    const data = { ...this.teacherForm.value };

    this.teacherService.updateTeacher(this.selectedTeacherId, data)
      .subscribe({
        next: () => {
          this.messageService.showSuccess('Teacher updated successfully');

          this.viewMode = 'LIST';
          this.getAllTeachers();
          this.resetForms();
        },
        error: () => {
          this.messageService.showError('Update failed');
        }
      });
  }

  // ================= RESET =================
  resetForms(): void {
    this.teacherForm.reset();
    this.otpForm.reset();
    this.selectedTeacherId = null;
    this.sentEmail = '';
  }

  clearMessages(): void {
    this.messageService.clear();
  }

  // ================= COUNT =================
  get activeTeachersCount(): number {
    return this.teachers?.filter(t => t.status === TeacherStatus.ACTIVE).length || 0;
  }

  get inactiveTeachersCount(): number {
    return this.teachers?.filter(t => t.status === TeacherStatus.INACTIVE).length || 0;
  }

  openAddForm(): void {
  this.resetForms();
  this.viewMode = 'ADD';
}

goBackToList(): void {
  this.resetForms();
  this.viewMode = 'LIST';
}

 goBack(): void {
  this.navigationService.goBack();
}
}