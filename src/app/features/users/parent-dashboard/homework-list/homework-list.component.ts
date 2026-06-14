import { Component, OnInit } from '@angular/core';
import { ParentDashboardService } from '../service/parent.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { TeacherDashboardService } from '../../teacher-dashboard/service/teacher.service';
import { apiResponseDto } from 'app/models/auth/response/api-response.dto';
import { FormsModule } from '@angular/forms';
import { HomeworkRequestDto } from 'app/models/auth/request/HomeworkRequestDto';
import { MessageService } from 'app/shared/message.service';
import { HomeworkService } from '../service/homeworkService';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-homework-list',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './homework-list.component.html',
  styleUrls: ['./homework-list.component.css']
})
export class HomeworkListComponent implements OnInit {

  homeworks: any[] = [];
  currentTime = new Date();
  role: string | null = null;
    dashboardData: any;
newHomework: {
  subject: string;
  description: string;
  dueDate: string;
} = {
  subject: '',
  description: '',
  dueDate: ''
};

constructor(
  private dashboardService: ParentDashboardService,
  private teacherDashboardService: TeacherDashboardService,
  private router: Router,
  private location: Location,
  public messageService: MessageService,   // ✅ ADD THIS
  private homeworkService:HomeworkService
) {}

  ngOnInit(): void {
    this.role = localStorage.getItem('role'); // 🔥 role read
    this.loadHomework();
  }
loadHomework() {

  console.log("ROLE =>", this.role);

  if (this.role === 'PARENT') {

    this.dashboardService.getDashboard()
      .subscribe((res: any) => {

        const data = res.data ?? res;

        this.homeworks = data?.homeworks || [];

      });

  }

  else if (this.role === 'TEACHER') {

    this.teacherDashboardService.getTeacherDashboard()
      .subscribe((res: any) => {

        const data = res.data ?? res;

        this.homeworks = data?.homeworkList || [];

        console.log("🔥 FINAL HOMEWORK:", this.homeworks);

      });

  }

  else {
    this.homeworks = [];
  }
}

createHomework() {

  console.log("Create Homework called");

  const payload: HomeworkRequestDto = {
    subject: this.newHomework.subject,
    description: this.newHomework.description,
    dueDate: this.newHomework.dueDate
  };

  if (this.role === 'TEACHER') {

    this.teacherDashboardService.createHomework(payload)
      .subscribe({
        next: (res) => {

          console.log("Homework Created", res);

          // ✅ SUCCESS MESSAGE
          this.messageService.showSuccess('Homework created successfully');

          // reset form
          this.newHomework = {
            subject: '',
            description: '',
            dueDate: ''
          };

          // refresh list
          this.loadHomework();
        },
        error: (err) => {

          console.error("Create homework error", err);

          // ✅ ERROR MESSAGE SHOW
          this.messageService.showError(
            err.error?.message || 'Something went wrong'
          );
        }
      });

  } else {
    this.messageService.showError("Only teacher can create homework");
  }
}  getTimerClass(dueDate: string): string {
    const now = new Date().getTime();
    const due = new Date(dueDate).getTime();
    const diff = due - now;

    if (diff <= 0) return 'overdue';

    const days = diff / (1000 * 60 * 60 * 24);
    if (days <= 1) return 'warning';

    return 'safe';
  }

  getTimeLeft(dueDate: string) {

    const now = this.currentTime.getTime();
    const due = new Date(dueDate).getTime();
    const diff = due - now;

    if (diff <= 0) return "❌ Overdue";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    if (days === 0) {
      return `⚠️ Due Today (${hours}h ${minutes}m left)`;
    }

    return `⏳ ${days}d ${hours}h ${minutes}m left`;
  }

  goBack(): void {
    this.location.back();
  }

  deleteHomework(id: number) {

  console.log("DELETE CLICKED", id);

  if (!confirm("Are you sure you want to delete this homework?")) {
    return;
  }

   this.homeworkService.deleteHomework(id)
    .subscribe({
      next: (res) => {
        this.messageService.showSuccess("Homework deleted successfully");
        this.loadHomework();
      },
      error: (err: HttpErrorResponse) => {
        this.messageService.showError(
          err.error?.message || "Delete failed"
        );
      }
    });
  }
}