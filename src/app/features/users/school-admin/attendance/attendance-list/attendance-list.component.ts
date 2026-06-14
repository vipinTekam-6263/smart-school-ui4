import { Component, inject, signal, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

import { AttendanceService } from '../../services/student-attendance.service';
import { MessageService } from 'app/shared/message.service';

import { AttendanceRequestDto } from 'app/models/auth/request/AttendanceRequestDto';
import { AttendanceResponseDto } from 'app/models/auth/response/AttendanceResponseDto';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DestroyRef } from '@angular/core';
interface AttendanceItem extends AttendanceResponseDto {
  selected?: boolean;
  studentPhoto?: string;
  checkInTime?: string;
}

@Component({
  selector: 'app-attendance-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './attendance-list.component.html',
  styleUrls: ['./attendance-list.component.css']
})
export class AttendanceListComponent {

  private attendanceService = inject(AttendanceService);
  private messageService = inject(MessageService);
    private destroyRef = inject(DestroyRef);

  // signals
  loading = signal(false);
  attendanceList = signal<AttendanceItem[]>([]);

  // filters
  selectedSection: number = 0;
  selectedDate: string = '';
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;

  sections: any[] = [];

  // ---------------- FILTERED ----------------
  filteredAttendanceList = computed(() => {
    let list = this.attendanceList();

    if (this.searchTerm) {
      list = list.filter(i =>
        i.studentName?.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    const start = (this.currentPage - 1) * this.itemsPerPage;
    return list.slice(start, start + this.itemsPerPage);
  });

  // ---------------- PAGINATION FIX ----------------
  totalPages = computed(() =>
    Math.ceil(this.attendanceList().length / this.itemsPerPage)
  );

  pages = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );

  // ---------------- STATS (NO LATE) ----------------
  stats = computed(() => {
    const list = this.attendanceList();
    return {
      present: list.filter(i => i.status === 'PRESENT').length,
      absent: list.filter(i => i.status === 'ABSENT').length,
      total: list.length
    };
  });

  // ---------------- API ----------------
  getSectionAttendance(sectionId: number, date: string) {


     console.log('SECTION:', sectionId);   // 🔥 YAHAN
  console.log('DATE:', date);           // 🔥 YAHAN

      
 if ((sectionId === null || sectionId === undefined) || !date) {
  this.messageService.showError('Select date');
  return;
}

    this.loading.set(true);
    this.currentPage = 1;

    this.attendanceService.getSectionAttendance(sectionId, date)
      .pipe(
    takeUntilDestroyed(this.destroyRef),   // ✅ YAHI LAGAO
        finalize(() => this.loading.set(false))
    //         finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (res) => {
          console.log('API RESPONSE:', res); // 🔥 DEBUG FIX
                console.log('API DATA:', res.data);       // ✅ ADD THIS

          const data = (res.data ?? []).map((item: any) => ({
            ...item,
            selected: false
          }));

          this.attendanceList.set(data);

          console.log('ATTENDANCE LIST:', this.attendanceList());

          this.messageService.showSuccess('Loaded successfully');
        },
        error: (err) => {
          console.error(err);
          this.messageService.showError('Failed to load attendance');
        }
      });
  }

updateAttendance(item: AttendanceItem) {

  if (!item || !item.id) {
    this.messageService.showError('Invalid attendance item');
    return;
  }

  const payload: AttendanceRequestDto = {
    studentClassId: item.studentClassId!,
    studentId: item.studentId!,
    sectionId: this.selectedSection,
    attendanceDate: item.attendanceDate!,
    status: item.status === 'PRESENT' ? 'PRESENT' : 'ABSENT',
    remarks: item.remarks ?? ''
  };

  this.attendanceService.updateAttendance(item.id, payload)
    .pipe( takeUntilDestroyed(this.destroyRef),   // ✅ YAHI LAGAO
    finalize(() => this.loading.set(false)))
    .subscribe({
      next: () => {
        this.messageService.showSuccess('Updated successfully');

        // UI update
        this.attendanceList.update(list =>
          list.map(i =>
            i.id === item.id ? { ...i, ...payload } : i
          )
        );
      },
      error: () => this.messageService.showError('Update failed')
    });
}  // ---------------- DELETE ----------------
  deleteAttendance(id: number) {
    this.attendanceService.deleteAttendance(id)
      .pipe( takeUntilDestroyed(this.destroyRef),   // ✅ YAHI LAGAO
    finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          this.attendanceList.update(list => list.filter(a => a.id !== id));
        },
        error: () => this.messageService.showError('Delete failed')
      });
  }

  // ---------------- BULK ----------------
  markBulkAttendance() {
    const selected = this.attendanceList().filter(i => i.selected);

    if (!selected.length) {
      this.messageService.showError('Select records');
      return;
    }

    const payload: AttendanceRequestDto[] = selected.map(item => ({
      studentClassId: item.studentClassId,
      studentId: item.studentId,
      sectionId: this.selectedSection,
      attendanceDate: item.attendanceDate,
      status: item.status as 'PRESENT' | 'ABSENT',
      remarks: item.remarks
    }));

    this.attendanceService.markBulkAttendance(payload)
      .pipe( takeUntilDestroyed(this.destroyRef),   // ✅ YAHI LAGAO
    finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => this.messageService.showSuccess('Bulk saved'),
        error: () => this.messageService.showError('Failed bulk save')
      });
  }

  // ---------------- UI ----------------
  trackByFn = (_: number, item: AttendanceItem) => item.id;

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage = page;
    }
  }

  selectAll(event: any) {
    const checked = event.target.checked;
    this.attendanceList.update(list =>
      list.map(i => ({ ...i, selected: checked }))
    );
  }

  toggleSelection(item: AttendanceItem) {
    this.attendanceList.update(list =>
      list.map(i =>
        i.id === item.id ? { ...i, selected: !i.selected } : i
      )
    );
  }

  onFilterChange() {
    this.currentPage = 1;
  }

  exportExcel() {
    this.messageService.showSuccess('Export coming soon');
  }

  editAttendance(item: AttendanceItem) {
    console.log('EDIT:', item);
  }

  // ---------------- COUNTERS ----------------
  getPresentCount() {
    return this.attendanceList().filter(i => i.status === 'PRESENT').length;
  }

  getAbsentCount() {
    return this.attendanceList().filter(i => i.status === 'ABSENT').length;
  }
updateSingle(item: AttendanceItem) {

  if (!item || !item.id) {
    this.messageService.showError('Invalid attendance item');
    return;
  }

  const payload: AttendanceRequestDto = {
    studentClassId: item.studentClassId!,
    studentId: item.studentId!,
    sectionId: this.selectedSection,
    attendanceDate: item.attendanceDate!,
    status: item.status === 'PRESENT' ? 'PRESENT' : 'ABSENT',
    remarks: item.remarks ?? ''
  };

this.updateAttendance(item);
}
}