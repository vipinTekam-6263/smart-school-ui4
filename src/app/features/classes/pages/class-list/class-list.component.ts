import { Component, OnInit, signal, effect, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import { ClassService } from '../../service/schoolClassCreateService';
import { AuthService } from 'app/core/services/auth.service';
import { MessageService } from 'app/shared/message.service';
import { CreateClassRequest } from 'app/models/auth/request/CreateClassRequest';
import { SchoolClass } from 'app/models/auth/request/SchoolClass.dto';
import { NavigationService } from 'app/shared/navigation.service';
interface ClassStats {
  total: number;
  active: number;
}

@Component({
  selector: 'app-class-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './class-list.component.html',
  styleUrls: ['./class-list.component.css']
})
export class ClassListComponent implements OnInit {

  private destroy$ = new Subject<void>();

  private fb = inject(FormBuilder);
  private classService = inject(ClassService);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
private navigationService = inject(NavigationService); 
  // ===== Signals =====
  classes = signal<SchoolClass[]>([]);
  loading = signal(false);
  searchTerm = signal('');
  filteredClasses = signal<SchoolClass[]>([]);

  classStats = signal<ClassStats>({ total: 0, active: 0 });

  schoolId = signal(0);
  selectedClassId = signal<number | null>(null);
  isEditMode = signal(false);

  // ===== Form =====
  classForm!: FormGroup;

  constructor() {

    // stats auto update
    effect(() => {
      const list = this.classes();
      this.classStats.set({
        total: list.length,
        active: list.filter(c => (c as any).isActive ?? true).length
      });

      // update filtered also
      this.filteredClasses.set(list);
    });

  }

  ngOnInit(): void {
    this.initForm();
    this.loadSchoolId();
    this.getClasses();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ================= FORM INIT =================
  private initForm(): void {
    this.classForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      isActive: [true]
    });
  }

  private loadSchoolId(): void {
    this.schoolId.set(this.authService.getSchoolId() || 1);
  }

  // ================= GET CLASSES =================
getClasses(): void {
  this.loading.set(true);

  this.classService.getClassesBySchool(this.schoolId())
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data) => {

        console.log("🔥 API DATA:", data);
        console.log("TOTAL:", data.length);
        console.log("ACTIVE:", data.filter(c => c.isActive === true).length);

        this.classes.set(data);

        // 🔥 FIXED STATS
        this.classStats.set({
          total: data.length,
          active: data.filter(c => c.isActive === true).length
        });

        this.loading.set(false);
      },

      error: () => {
        this.loading.set(false);
        this.messageService.showError('Failed to load classes');
      }
    });
}

// ================= ADD CLASS =================
  addClass() {
  const schoolId = this.authService.getSchoolId();

  if (!schoolId) {
    console.error("❌ schoolId missing");
    return;
  }

  const payload:CreateClassRequest  = {
    name: this.classForm.value.name,
    isActive: this.classForm.value.isActive,
    school: {
      id: schoolId
    }
  };

  console.log("📦 PAYLOAD:", payload); // debug

  this.classService.createClass(payload).subscribe({
    next: () => {
      console.log("✅ CLASS ADDED");
      this.getClasses();
    },
    error: (err) => console.error("❌ ERROR:", err)
  });
}

  // ================= EDIT =================
  editClass(cls: SchoolClass): void {
    this.isEditMode.set(true);
    this.selectedClassId.set(cls.id);

    this.classForm.patchValue({
      name: cls.name,
      isActive: (cls as any).isActive ?? true
    });
  }

  // ================= UPDATE =================
 updateClass(): void {

  if (!this.selectedClassId() || this.classForm.invalid) {
    return;
  }

  const payload: SchoolClass = {
    id: this.selectedClassId()!,
    name: this.classForm.value.name,
    isActive: this.classForm.value.isActive,   // 🔥 important (missing tha)
    isDeleted: false,
    school: {
      id: Number(localStorage.getItem('schoolId'))
    }
  };

  this.classService.updateClass(
    this.selectedClassId()!,
    payload
  ).subscribe({

    next: (res) => {

      // 🔥 better approach: replace updated item
      this.classes.update(list =>
        list.map(c => c.id === res.id ? res : c)
      );

      this.getClasses(); // refresh sync
      this.resetForm();

      this.messageService.showSuccess('Updated successfully');
    },

    error: () =>
      this.messageService.showError('Update failed')
  });
}

// ================= DELETE =================
deleteClass(id: number): void {
  if (!confirm('Are you sure?')) return;

  this.classService.deleteClass(id).subscribe({
    next: () => {
      this.getClasses(); // 🔥 BEST FIX
      this.messageService.showSuccess('Deleted successfully');
    },
    error: () => this.messageService.showError('Delete failed')
  });
}

  // ================= SEARCH =================
  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchTerm.set(value);

    const filtered = this.classes().filter(c =>
      c.name.toLowerCase().includes(value)
    );

    this.filteredClasses.set(filtered);
  }

  // ================= RESET =================
  resetForm(): void {
    this.classForm.reset({ isActive: true });
    this.isEditMode.set(false);
    this.selectedClassId.set(null);
  }

  trackByFn(index: number, item: SchoolClass): number {
    return item.id;
  }

  get f() {
    return this.classForm.controls;
  }

  get isAddMode() {
    return !this.isEditMode();
  }

  goBack(): void {
  this.navigationService.goBack();
}
}