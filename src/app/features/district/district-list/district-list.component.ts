import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { DistrictService } from '../district.service';
import { DistrictRequest } from 'app/models/auth/request/District-Request.dto';
import { DistrictResponse } from 'app/models/auth/response/district-response.dto';
import { PageResponse } from 'app/models/auth/response/pagination-response.dto';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ErrorHandlerService } from 'app/core/Error handler/error-handler.service';

@Component({
  selector: 'app-district-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatProgressSpinnerModule,
    NgxMatSelectSearchModule  
  ],
  templateUrl: './district-list.component.html',
  styleUrls: ['./district-list.component.css']
})
export class DistrictListComponent implements OnInit, OnDestroy {

  // ================= DATA =================
  districts: DistrictResponse[] = [];
  totalElements = 0;

  // ================= PAGINATION =================
  page = 0;
  size = 10;

  // ================= UI =================
  isLoading = false;
  showAddForm = false;
  isEditMode = false;
  isAdding = false;

  selectedDistrict: DistrictResponse | null = null;

  // ================= FORM =================
  districtName = '';
  stateId: number | null = null;

  // ================= TABLE =================
  displayedColumns: string[] = ['id', 'districtName', 'stateId', 'actions'];

  private destroy$ = new Subject<void>();

  constructor(
    private districtService: DistrictService,
    private snackBar: MatSnackBar,
    private errorHandler: ErrorHandlerService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.loadDistricts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ================= LOAD =================
  loadDistricts(): void {
    this.isLoading = true;

    this.districtService.getAllDistricts(this.page, this.size)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: PageResponse<DistrictResponse>) => {
          this.districts = res.content || [];
          this.totalElements = res.totalElements || 0;
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          this.errorHandler.handleError(err);
          this.showError(err?.message || 'Failed to load districts');
        }
      });
  }

  // ================= PAGINATION =================
  onPageChange(event: PageEvent): void {
    this.page = event.pageIndex;
    this.size = event.pageSize;
    this.loadDistricts();
  }

  // ================= ADD =================
  addDistrict(): void {
    if (!this.districtName?.trim() || this.stateId == null) {
      this.showError('Please fill all required fields');
      return;
    }

    this.isAdding = true;

    const req: DistrictRequest = {
      districtName: this.districtName.trim(),
      stateId: this.stateId
    };

    this.districtService.addDistrict(req)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.showSuccess('District added successfully!');
          this.resetForm();
          this.showAddForm = false;
          this.loadDistricts();
          this.isAdding = false;
        },
        error: (err) => {
          this.isAdding = false;
          this.errorHandler.handleError(err);
          this.showError(err?.message || 'Failed to add district');
        }
      });
  }

  // ================= UPDATE =================
  updateDistrict(): void {
    if (!this.selectedDistrict?.id) return;

    this.isAdding = true;

    const req: DistrictRequest = {
      districtName: this.districtName.trim(),
      stateId: this.stateId!
    };

    this.districtService.updateDistrict(this.selectedDistrict.id, req)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.showSuccess('District updated successfully!');
          this.resetForm();
          this.showAddForm = false;
          this.loadDistricts();
          this.isAdding = false;
        },
        error: (err) => {
          this.isAdding = false;
          this.showError(err?.message || 'Update failed');
        }
      });
  }

  // ================= DELETE =================
  deleteDistrict(id: number): void {
    if (!confirm('Are you sure?')) return;

    this.districtService.deleteDistrict(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.showSuccess('District deleted successfully!');
          this.loadDistricts();
        },
        error: (err) => {
          this.errorHandler.handleError(err);
          this.showError(err?.message || 'Delete failed');
        }
      });
  }

  // ================= EDIT =================
  editDistrict(district: DistrictResponse): void {
    this.selectedDistrict = district;
    this.isEditMode = true;
    this.showAddForm = true;

    this.districtName = district.districtName;
    this.stateId = district.stateId;
  }

  // ================= UI =================
  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;

    if (!this.showAddForm) {
      this.resetForm();
    }
  }

  goBack(): void {
    this.location.back();
  }

  // ================= RESET =================
  private resetForm(): void {
    this.districtName = '';
    this.stateId = null;
    this.isEditMode = false;
    this.selectedDistrict = null;
  }

  // ================= SNACKBAR =================
  private showSuccess(msg: string): void {
    this.snackBar.open(msg, '✕', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showError(msg: string): void {
    this.snackBar.open(msg, '✕', {
      duration: 4000,
      panelClass: ['error-snackbar']
    });
  }
}