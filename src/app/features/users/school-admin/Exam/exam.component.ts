import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ExamService } from '../services/exam-service';
import { MessageService } from 'app/shared/message.service';
import { ExamScheduleRequest } from 'app/models/auth/request/Exam-Schedule-Request.dto';
import { ExamResponseScheduleDTO } from 'app/models/auth/response/Exam-response.dto';
import { ClassService } from 'app/features/classes/service/schoolClassCreateService';

@Component({
  selector: 'app-exam',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})
export class ExamComponent implements OnInit {

  examForm!: FormGroup;

  exams: ExamResponseScheduleDTO[] = [];
  academicYears: any[] = [];
  classes: any[] = [];

  isLoading = false;
  isEditMode = false;
  selectedExamId: number | null = null;

  schoolId!: number;

  constructor(
    private fb: FormBuilder,
    private examService: ExamService,
    private classService: ClassService,
    public messageService: MessageService
  ) {}

  ngOnInit(): void {
    console.log('ExamComponent loaded');

    this.schoolId = 1;

    this.initForm();
    this.loadClasses();
    this.loadAcademicYears();
    this.loadExams();
  }

  // ================= FORM =================
  initForm(): void {
    this.examForm = this.fb.group({
      classId: [null, Validators.required],
      sectionId: [null, Validators.required],
      academicYearId: [null, Validators.required],
      examType: [null, Validators.required],
      subject: ['', [Validators.required, Validators.minLength(2)]],
      examDate: [null, Validators.required],
      startTime: [null, Validators.required],
      endTime: [null, Validators.required],
      maxMarks: [null, [Validators.required, Validators.min(1)]],
      passingMarks: [null]
    });
  }

  // ================= CLASSES =================
  loadClasses(): void {
    this.classService.getClassesBySchool(this.schoolId).subscribe({
      next: (res: any) => {
        this.classes = res?.data || res || [];
        console.log('Classes:', this.classes);
      },
      error: (err) => {
        console.error(err);
        this.messageService.showError('Failed to load classes');
      }
    });
  }

  // ================= ACADEMIC YEARS =================
loadAcademicYears(): void {

  this.examService.getAcademicYears(this.schoolId).subscribe({
    next: (res: any) => {

      const parsed = typeof res === 'string' ? JSON.parse(res) : res;

      this.academicYears = parsed?.data || [];

      console.log('Academic Years:', this.academicYears);

      if (this.academicYears.length > 0) {

        const defaultYear = this.academicYears[0].id;

        this.examForm.patchValue({
          academicYearId: defaultYear
        });

        console.log('Default year set:', defaultYear);

        // 🔥 IMPORTANT FIX
        setTimeout(() => {
          this.loadExams();
        }, 0);
      }
    },
    error: (err) => {
      console.error(err);
    }
  });
}

  // ================= LOAD EXAMS =================
loadExams(yearId?: number): void {

  const id = yearId ?? this.examForm.get('academicYearId')?.value;

  console.log('📌 schoolId:', this.schoolId);
  console.log('📌 academicYearId:', id);

  if (!this.schoolId || !id) {
    console.log('⛔ Skipping API call - missing data');
    return;
  }

  this.examService.getSchoolExams(this.schoolId, id)
    .subscribe({
      next: (res) => {
        this.exams = res?.data || [];
      },
      error: (err) => console.error(err)
    });
}
  // ================= CREATE =================
 createExam(): void {

  if (this.examForm.invalid) {
    this.markTouched();
    this.messageService.showError('Please fill all required fields');
    return;
  }

  const v = this.examForm.value;

  const payload: ExamScheduleRequest = {
    classId: Number(v.classId),
    sectionId: Number(v.sectionId),
    academicYearId: Number(v.academicYearId),
    examType: v.examType,
    subject: v.subject,
    examDate: v.examDate,

    // ✅ FIX TIME FORMAT (NO DOUBLE :00 ISSUE)
    startTime: v.startTime?.length === 5 ? v.startTime + ':00' : v.startTime,
    endTime: v.endTime?.length === 5 ? v.endTime + ':00' : v.endTime,

    maxMarks: Number(v.maxMarks),
    passingMarks: Number(v.passingMarks),
    schoolId: this.schoolId
  };

  console.log('CREATE PAYLOAD:', payload);

  this.isLoading = true;

  this.examService.createExam(payload).subscribe({
    next: () => {
      this.messageService.showSuccess('Exam created successfully');
      this.resetForm();
      this.loadExams();
      this.isLoading = false;
    },
    error: (err) => {
      console.error('CREATE ERROR:', err);

      const msg =
        err?.error?.message ||
        'Exam already exists or invalid data';

      this.messageService.showError(msg);
      this.isLoading = false;
    }
  });
}

  // ================= EDIT =================
  editExam(exam: any): void {
    this.isEditMode = true;
    this.selectedExamId = exam.id;

    this.examForm.patchValue(exam);
  }

  // ================= UPDATE =================
updateExam(): void {

  if (this.examForm.invalid || !this.selectedExamId) {
    this.markTouched();
    this.messageService.showError('Fill all required fields');
    return;
  }

  const v = this.examForm.value;

  console.log('FORM VALUE:', v);

  const payload: ExamScheduleRequest = {
    classId: Number(v.classId),
    sectionId: Number(v.sectionId),
    academicYearId: Number(v.academicYearId), // 🔥 FIX IMPORTANT

    examType: v.examType,
    subject: v.subject,
    examDate: v.examDate,

    // ✅ TIME FIX (safe handling)
    startTime: v.startTime?.length === 5 ? v.startTime + ':00' : v.startTime,
    endTime: v.endTime?.length === 5 ? v.endTime + ':00' : v.endTime,

    maxMarks: Number(v.maxMarks),
    passingMarks: Number(v.passingMarks),

    schoolId: this.schoolId
  };

  console.log('🔥 UPDATE PAYLOAD:', payload);

  this.isLoading = true;

  this.examService.updateExam(this.selectedExamId, payload).subscribe({
    next: (res) => {
      console.log('UPDATE SUCCESS:', res);

      this.messageService.showSuccess('Updated successfully');

      this.resetForm();
      this.loadExams();

      this.isLoading = false;
    },

    error: (err) => {
      console.error('❌ UPDATE ERROR:', err);

      const msg =
        err?.error?.message ||
        'Validation failed during update';

      this.messageService.showError(msg);

      this.isLoading = false;
    }
  });
}
  // ================= DELETE =================
  deleteExam(id: number): void {
    if (!confirm('Delete exam?')) return;

    this.examService.deleteExam(id).subscribe({
      next: () => {
        this.messageService.showSuccess('Deleted successfully');
        this.loadExams();
      },
      error: (err) => {
        console.error(err);
        this.messageService.showError('Delete failed');
      }
    });
  }

  // ================= SUBMIT =================
  onSubmit(): void {
    this.isEditMode ? this.updateExam() : this.createExam();
  }

resetForm(): void {
  this.examForm.reset();

  this.isEditMode = false;
  this.selectedExamId = null;

  // 🔥 IMPORTANT: default academic year वापस set करो
  if (this.academicYears.length > 0) {
    this.examForm.patchValue({
      academicYearId: this.academicYears[0].id
    });
  }
}

  private markTouched(): void {
    Object.values(this.examForm.controls).forEach(c => c.markAsTouched());
  }
}