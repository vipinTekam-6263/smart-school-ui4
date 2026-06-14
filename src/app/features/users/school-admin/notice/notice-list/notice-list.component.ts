import { Component, OnInit } from '@angular/core';
import { NoticeService } from '../../services/noitce-service';
import { NoticeResponse } from 'app/models/auth/response/Notice-Response.dto';
import { MessageService } from 'app/shared/message.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NoticeRequest } from 'app/models/auth/request/Notice-Request.dto';

@Component({
  selector: 'app-notice-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './notice-list.component.html',
  styleUrls: ['./notice-list.component.css']
})
export class NoticeListComponent implements OnInit {

  notices: NoticeResponse[] = [];
  schoolId!: number;

  isEditMode = false;
  selectedNoticeId: number | null = null;

  form!: FormGroup;

  constructor(
    private noticeService: NoticeService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.setSchoolId();
    this.initForm();
    this.loadNotices();
  }

  // ================= FORM INIT =================
  initForm() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
     classId: [null, Validators.required],      // ✅ FIX
    sectionId: [null, Validators.required],  
      noticeFor: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  // ================= SCHOOL ID =================
  setSchoolId() {
   console.log("USER FROM STORAGE =>", localStorage.getItem('user'));

  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    this.schoolId = user?.schoolId || null;

    console.log("SCHOOL ID =>", this.schoolId);
  } catch {
    this.schoolId = null as any;
  }
  }

  // ================= LOAD =================
  loadNotices() {
    if (!this.schoolId) {
      this.messageService.showError('School ID not found');
      return;
    }

    this.noticeService.getSchoolNotices(this.schoolId).subscribe({
      next: (res) => {
        if (res.status) {
          this.notices = res.data;
        } else {
          this.messageService.showError(res.message);
        }
      },
      error: () => this.messageService.showError('Failed to load notices')
    });
  }

  // ================= CREATE =================
  createNotice() {

  
  console.log("FORM VALUE =>", this.form.value);

    if (this.form.invalid) {
      this.messageService.showError('Please fill all required fields');
      return;
    }

    const payload: NoticeRequest = {
      schoolId: this.schoolId,
      classId: this.form.value.classId || null,
      sectionId: this.form.value.sectionId || null,
      title: this.form.value.title,
      description: this.form.value.description,
      noticeFor: this.form.value.noticeFor,
      isActive: true,
      startDate: this.form.value.startDate,
      endDate: this.form.value.endDate
    };

    this.noticeService.createNotice(payload).subscribe({
      next: (res) => {
        if (res.status) {
          this.messageService.showSuccess('Notice created successfully');
          this.loadNotices();
          this.resetState();
        } else {
          this.messageService.showError(res.message);
        }
      },
      error: () => this.messageService.showError('Create failed')
    });
  }

  // ================= UPDATE =================
  updateNotice() {
    if (!this.selectedNoticeId) {
      this.messageService.showError('Select notice first');
      return;
    }

    if (this.form.invalid) {
      this.messageService.showError('Please fill all required fields');
      return;
    }

    const payload: NoticeRequest = {
      schoolId: this.schoolId,
      classId: this.form.value.classId || null,
      sectionId: this.form.value.sectionId || null,
      title: this.form.value.title,
      description: this.form.value.description,
      noticeFor: this.form.value.noticeFor,
      isActive: true,
      startDate: this.form.value.startDate,
      endDate: this.form.value.endDate
    };

    this.noticeService.updateNotice(this.selectedNoticeId, payload).subscribe({
      next: (res) => {
        this.messageService.showSuccess('Updated successfully');
        this.loadNotices();
        this.resetState();
      },
      error: () => this.messageService.showError('Update failed')
    });
  }

  // ================= DELETE =================
  deactivate(id: number) {
    this.noticeService.deactivateNotice(id).subscribe({
      next: (res) => {
        this.messageService.showSuccess(res.message || 'Deactivated');
        this.loadNotices();
      },
      error: () => this.messageService.showError('Error while deactivating')
    });
  }

  // ================= ACTIVATE =================
  activate(id: number) {
    this.messageService.showSuccess('Activate API not connected yet');
  }

  // ================= EDIT =================
  editNotice(notice: NoticeResponse) {
    this.isEditMode = true;
    this.selectedNoticeId = notice.id;

    this.form.patchValue({
      classId: notice.classId,
      sectionId: notice.sectionId,
      title: notice.title,
      description: notice.description,
      noticeFor: notice.noticeFor,
      startDate: notice.startDate,
      endDate: notice.endDate
    });
  }

  // ================= RESET =================
  resetState() {
    this.isEditMode = false;
    this.selectedNoticeId = null;
    this.form.reset();
  }

  trackByFn(index: number, item: any) {
    return item.id;
  }
}