import { Component, OnInit, OnDestroy } from '@angular/core';
import { ParentDashboardService } from '../service/parent.service';
import { ParentDashboardDto } from 'app/models/auth/response/ParentDashboardDto';
import { Subject, takeUntil, finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  dashboardData: ParentDashboardDto | null = null;

  isLoading = false;
  errorMessage = '';

  private destroy$ = new Subject<void>();

    intervalId: any;
  currentTime = new Date();

  constructor(private dashboardService: ParentDashboardService,
     private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboard();

     this.intervalId = setInterval(() => {
    this.currentTime = new Date();
  }, 1000);
  }

  loadDashboard(): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.dashboardService.getDashboard()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({

        next: (res) => {
          console.log('Dashboard Response =>', res);

          this.dashboardData = res.data;

          if (!this.dashboardData) {
            this.errorMessage = 'No data available';
          }
        },

        error: (err) => {
          console.error('Dashboard Error =>', err);
          this.handleError(err);
        }
      });
  }

  private handleError(err: any): void {
    if (err.status === 0) {
      this.errorMessage = 'Server not reachable!';
    } else if (err.status === 401) {
      this.errorMessage = 'Session expired. Please login again.';
    } else if (err.status === 403) {
      this.errorMessage = 'You are not authorized.';
    } else if (err.status === 404) {
      this.errorMessage = 'Data not found.';
    } else if (err.status === 500) {
      this.errorMessage = 'Internal server error.';
    } else {
      this.errorMessage = err?.error?.message || 'Something went wrong!';
    }
  }

  retry(): void {
    this.loadDashboard();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
goToHomeworkPage() {
  this.router.navigate(['/homework-list']);
}

getTimeLeft(dueDate: string) {

  const now = new Date().getTime();
  const due = new Date(dueDate).getTime();

  const diff = due - now;

  if (diff <= 0) return "❌ Overdue";

  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);

  return `⏳ ${d}d ${h}h ${m}m left`;
}

  
}