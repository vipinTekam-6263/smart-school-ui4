// state-list.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router'; // ✅ ADD THIS

import { StateService } from 'app/features/states/state.service';
import { StateRequest } from 'app/models/auth/request/State-Request.dto';
import { StateResponse } from 'app/models/auth/response/State-Response.dto';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';

import { ErrorHandlerService } from 'app/core/Error handler/error-handler.service';

@Component({
  selector: 'app-state-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatCardModule
  ],
  templateUrl: './state-list.component.html',
  styleUrls: ['./state-list.component.css']
})
export class StateListComponent implements OnInit, OnDestroy {

  // 🔥 Data
  states: StateResponse[] = [];
  dataSource = new MatTableDataSource<StateResponse>(this.states);
  totalStates = 0;
  isLoading = false;

  // 🔥 Add Form
  showAddForm = false;
  newStateName = '';
  isAdding = false;

  // 🔥 Search & Pagination
  searchTerm = '';
  pageSize = 10;
  currentPage = 0;

  // 🔥 Table
  displayedColumns: string[] = ['id', 'stateName', 'actions'];

  // 🔥 Destroy
  private destroy$ = new Subject<void>();

  constructor(
    private stateService: StateService,
    private snackBar: MatSnackBar,
    private errorHandler: ErrorHandlerService,
    private location: Location,
    private router: Router // ✅ ADD THIS
  ) {}

  ngOnInit(): void {
    this.loadStates();
    this.loadTotalStates();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ================= LOAD STATES =================
  loadStates(): void {
    this.isLoading = true;

    this.stateService.getAllStates()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (states: StateResponse[]) => {
          this.states = states;
          this.dataSource.data = states;
          this.isLoading = false;
          this.showSuccess('States loaded successfully!');
        },
        error: (error) => {
          this.isLoading = false;
          this.errorHandler.handleError(error);
          this.showError(error?.message || 'Failed to load states');
        }
      });
  }

  // ================= TOTAL STATES =================
  loadTotalStates(): void {
    this.stateService.getTotalStates()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (count) => {
          this.totalStates = count;
        },
        error: (error) => {
          this.errorHandler.handleError(error);
          this.showError('Failed to load count');
        }
      });
  }

  // ================= ADD STATE =================
  addState(): void {
    if (!this.newStateName?.trim()) {
      this.showError('State name is required!');
      return;
    }

    this.isAdding = true;

    const request: StateRequest = {
      stateName: this.newStateName.trim()
    };

    this.stateService.addState(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isAdding = false;
          this.newStateName = '';
          this.showAddForm = false;
          this.loadStates();
          this.loadTotalStates();
          this.showSuccess('State added successfully!');
        },
        error: (error) => {
          this.isAdding = false;
          this.errorHandler.handleError(error);
          this.showError(error?.message || 'Failed to add state');
        }
      });
  }

  // ================= DELETE =================
  deleteState(id: number): void {
    if (confirm('Are you sure?')) {
      this.stateService.deleteState(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadStates();
            this.loadTotalStates();
            this.showSuccess('State deleted successfully!');
          },
          error: (error) => {
            this.errorHandler.handleError(error);
            this.showError(error?.message || 'Failed to delete state');
          }
        });
    }
  }

  // ================= SEARCH =================
  searchStates(): void {
    if (this.searchTerm.trim()) {
      this.stateService.searchStates(this.searchTerm)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (states) => {
            this.dataSource.data = states;
          },
          error: (error) => {
            this.errorHandler.handleError(error);
            this.showError('Search failed!');
          }
        });
    } else {
      this.loadStates();
    }
  }

  // ================= REFRESH =================
  refreshStates(): void {
    this.stateService.refreshStates()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.showSuccess('States refreshed!');
        },
        error: (error) => {
          this.errorHandler.handleError(error);
          this.showError(error?.message || 'Refresh failed');
        }
      });
  }

  // ================= FILTER =================
  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  // ================= SNACKBAR =================
  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  // ================= UI =================
  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.newStateName = '';
    }
  }

  getStateStatus(stateName: string): string {
    return stateName ? 'Active' : 'Inactive';
  }

  isStateFormInvalid(): boolean {
    return this.isAdding || !this.newStateName || !this.newStateName.trim();
  }

  // 🔥 BACK BUTTON
  goBack() {
    if (history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/dashboard']);
    }
  }


  // 🔥 UPDATE MODE
isEditMode = false;
editStateId: number | null = null;

// 🔥 EDIT CLICK
editState(state: StateResponse): void {
  this.showAddForm = true;
  this.isEditMode = true;
  this.editStateId = state.id;
  this.newStateName = state.stateName;
}

// 🔥 UPDATE STATE
updateState(): void {
  if (!this.newStateName?.trim() || this.editStateId === null) return;

  this.isAdding = true;

  const request: StateRequest = {
    stateName: this.newStateName.trim()
  };

  this.stateService.updateState(this.editStateId, request)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () => {
        this.isAdding = false;
        this.resetForm();
        this.loadStates();
        this.loadTotalStates();
        this.showSuccess('State updated successfully!');
      },
      error: (error) => {
        this.isAdding = false;
        this.errorHandler.handleError(error);
        this.showError(error?.message || 'Failed to update state');
      }
    });
}

// 🔥 RESET FORM
resetForm(): void {
  this.newStateName = '';
  this.showAddForm = false;
  this.isEditMode = false;
  this.editStateId = null;
}
}