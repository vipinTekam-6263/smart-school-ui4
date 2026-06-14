import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

import { SchoolService } from '../services/school.service';
import { SchoolResponse } from 'app/models/auth/response/school-response.dto';
import { apiResponseDto } from 'app/models/auth/response/api-response.dto';
import { DistrictService } from 'app/features/district/district.service';
import { DistrictResponse } from 'app/models/auth/response/district-response.dto';

import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

interface SchoolTableData {
  schools: SchoolResponse[];
  totalPages: number;
  currentPage: number;
  totalElements: number;
  pageSize: number;
  isLoading: boolean;
  error: string | null;
}

@Component({
  selector: 'app-school-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    NgxMatSelectSearchModule
  ],
  templateUrl: './school-list.component.html',
  styleUrls: ['./school-list.component.css']
})
export class SchoolListComponent implements OnInit, OnDestroy {

  // ================= TABLE =================
  tableData: SchoolTableData = {
    schools: [],
    totalPages: 0,
    currentPage: 0,
    totalElements: 0,
    pageSize: 10,
    isLoading: false,
    error: null
  };

  searchForm: FormGroup;

  selectedDistrictId: number | null = null;
  districts: DistrictResponse[] = [];

  showAddForm: boolean = false;
  isEditMode: boolean = false;

  selectedSchool: SchoolResponse | null = null;

  schoolName: string = '';
  code: string = '';
  districtId: number | null = null;
  address: string = '';

  districtSearch: string = '';

  private destroy$ = new Subject<void>();

  constructor(
    private schoolService: SchoolService,
    private districtService: DistrictService,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      search: [''],
      districtId: [null]
    });
  }

  ngOnInit(): void {
    this.loadDistricts();
    this.loadSchools();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ================= LOAD SCHOOLS =================
 loadSchools(page: number = 0): void {
  this.tableData.isLoading = true;

  const districtId = this.selectedDistrictId;

  const request$ = districtId
    ? this.schoolService.getSchoolsByDistrict(districtId, page, this.tableData.pageSize)
    : this.schoolService.getAllSchools(page, this.tableData.pageSize);

  request$
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res: apiResponseDto<any>) => {

        const data = res.data;

        this.tableData.schools = data.content || [];
        this.tableData.totalPages = data.totalPages || 0;
        this.tableData.totalElements = data.totalElements || 0;
        this.tableData.currentPage = data.number || 0;
        this.tableData.isLoading = false;

      },
      error: (err) => {
        this.handleError(err);
      }
    });
}
  // ================= DISTRICTS =================
  loadDistricts(): void {
    this.districtService.getAllDistricts(0, 100).subscribe({
      next: (res: any) => {
        this.districts = res.content || res.data || [];
      },
      error: () => this.districts = []
    });
  }

  // ================= ADD =================
  addSchool(): void {
  if (!this.schoolName || !this.code || !this.districtId || !this.address) {
    alert("Please fill all fields");
    return;
  }

  const payload = {
    schoolName: this.schoolName,
    code: this.code,
    districtId: this.districtId,
    address: this.address
  };

  this.schoolService.createSchool(payload).subscribe({
    next: () => {
      alert("School added successfully");

      this.resetForm();
      this.showAddForm = false;

      // 🔥 IMPORTANT FIX
     // this.selectedDistrictId = null;   // reset filter
      this.loadSchools(0);              // reload fresh list
    },
    error: (err) => {
      alert(err?.error?.message || "Something went wrong");
    }
  });
}
  // ================= UPDATE =================
  updateSchool(): void {

    console.log("UPDATE ID =>", this.selectedSchool?.id);
    if (!this.selectedSchool?.id) return;

    const payload = { schoolName: this.schoolName, code: this.code, districtId: this.districtId, address: this.address };

    this.schoolService.updateSchool(this.selectedSchool.id, payload)
      .subscribe({
        next: () => {
          alert("School updated successfully");
          this.resetForm();
          this.showAddForm = false;
          this.loadSchools();
        },
        error: (err) => alert(err.message)
      });
  }

  editSchool(school: SchoolResponse): void {

      console.log("EDIT ID =>", school.id);

    this.selectedSchool = school;
    this.isEditMode = true;
    this.showAddForm = true;

    this.schoolName = school.schoolName;
    this.code = school.code;
    this.districtId = school.districtId;
    this.address = school.address;
  }

  resetForm(): void {
    this.isEditMode = false;
    this.selectedSchool = null;

    this.schoolName = '';
    this.code = '';
    this.districtId = null;
    this.address = '';
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) this.resetForm();
  }

  onDeleteSchool(id: number): void {
  console.log("DELETE API CALL ID =>", id);

  if (!id) {
    console.log("Invalid ID");
    return;
  }

  const confirmDelete = confirm('Are you sure you want to delete this school?');

  if (!confirmDelete) return;

  this.schoolService.deleteSchool(id).subscribe({
    next: (res) => {
      console.log("DELETE SUCCESS =>", res);

      // 🔥 refresh list properly
      this.loadSchools(this.tableData.currentPage || 0);
    },
    error: (err) => {
      console.log("DELETE ERROR =>", err);

      alert(err?.error?.message || "Delete failed");
    }
  });
}
  private handleError(error: any): void {
    this.tableData.isLoading = false;
    this.tableData.error = error?.message || 'Something went wrong';
  }

  trackBySchoolId(index: number, item: SchoolResponse): number {
    return item.id;
  }

  // ================= FILTER =================
  get filteredDistricts(): DistrictResponse[] {
    if (!this.districtSearch) return this.districts;

    return this.districts.filter(d =>
      d.districtName.toLowerCase().includes(this.districtSearch.toLowerCase())
    );
  }

  getDistrictName(id: number): string {
  const district = this.districts.find(d => d.id === id);
  return district ? district.districtName : 'N/A';
}
}