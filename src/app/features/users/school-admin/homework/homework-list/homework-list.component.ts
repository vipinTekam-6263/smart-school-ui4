import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { HomeworkService } from 'app/features/users/parent-dashboard/service/homeworkService';
import { HomeworkDto } from 'app/models/auth/response/HomeworkDto';
import { NavigationService } from 'app/shared/navigation.service';
@Component({
  selector: 'app-admin-homework',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './homework-list.component.html',
styleUrls: ['./homework-list.component.css']
})
export class AdminHomeworkComponent implements OnInit, OnDestroy {
  
  // Data
  homeworks: HomeworkDto[] = [];
  filteredHomeworks: HomeworkDto[] = [];
  
  // UI States
  loading = false;
  deletingId: number | null = null;
  error = '';
  
  // Filters
  selectedClass: string = '';
  selectedSection: string = '';
  selectedDate: string = '';
  
  // RxJS
  private destroy$ = new Subject<void>();
  private filter$ = new Subject<void>();

  constructor(private homeworkService: HomeworkService,
    private navigationService:NavigationService
  ) {}

  ngOnInit(): void {
    this.loadHomework();
    this.setupFilterDebounce();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ================= LOAD ALL =================
  loadHomework() {
    this.loading = true;
    this.error = '';
    
    this.homeworkService.getAllHomework().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res) => {
        this.homeworks = res;
        this.filteredHomeworks = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load homework. Please try again.';
        console.error('Load Homework Error:', err);
        this.loading = false;
      }
    });
  }

  // ================= FILTER =================
  private setupFilterDebounce() {
    this.filter$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.applyFilter();
    });
  }

  onFilterChange() {
    this.filter$.next();
  }

  applyFilter() {
    this.filteredHomeworks = this.homeworks.filter(hw => {
      const matchClass = this.selectedClass
        ? hw.className?.trim() === this.selectedClass.trim()
        : true;

      const matchSection = this.selectedSection
        ? hw.sectionName?.trim() === this.selectedSection.trim()
        : true;

      const matchDate = this.selectedDate
        ? this.formatDate(hw.dueDate) === this.selectedDate
        : true;

      return matchClass && matchSection && matchDate;
    });
  }

   formatDate(dateString: string | null | undefined): string {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  }

  // ================= DELETE =================
  deleteHomework(id: number) {
    if (confirm('Are you sure you want to delete this homework? This action cannot be undone.')) {
      this.deletingId = id;
      
      this.homeworkService.deleteHomework(id).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: () => {
          // Optimistic update
          this.homeworks = this.homeworks.filter(h => h.id !== id);
          this.filteredHomeworks = this.filteredHomeworks.filter(h => h.id !== id);
          this.deletingId = null;
        },
        error: (err) => {
          console.error('Delete Error:', err);
          this.error = 'Failed to delete homework. Please try again.';
          this.deletingId = null;
          alert('Delete failed! Please try again.');
        }
      });
    }
  }

  // ================= REFRESH =================
  refresh() {
    this.error = '';
    this.loadHomework();
  }

  // ================= CLEAR FILTERS =================
  clearFilters() {
    this.selectedClass = '';
    this.selectedSection = '';
    this.selectedDate = '';
    this.filteredHomeworks = this.homeworks;
  }

  // ================= GET CLASSES FOR DROPDOWN =================
getUniqueClasses(): string[] {
  return Array.from(
    new Set(this.homeworks.map(hw => hw.className).filter((v): v is string => !!v))
  ).sort();
}

getUniqueSections(): string[] {
  return Array.from(
    new Set(this.homeworks.map(hw => hw.sectionName).filter((v): v is string => !!v))
  ).sort();
}

  trackByFn(index: number, item: HomeworkDto): number {
    return item.id;
  }

    isOverdue(dueDate: string | null): boolean {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  }


}