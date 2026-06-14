import { Component, OnInit } from '@angular/core';
import { PlanService } from '../services/plan.service';
import { MessageService } from 'app/shared/message.service';
import { PlanRequestDTO } from 'app/models/auth/request/PlanRequestDTO';
import { PlanResponseDTO } from 'app/models/auth/response/PlanResponseDTO';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-plan',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './plan.component.html',
  styleUrls: ['./plan.component.css']
})
export class PlanComponent implements OnInit {

  // ✅ Plans list
  plans: PlanResponseDTO[] = [];

  // ✅ Reactive Form
  planForm!: FormGroup;

  // ✅ UI States
  selectedPlanId: number | null = null;
  loading = false;
  submitting = false;

  constructor(
    private planService: PlanService,
    public messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadPlans();
  }

  // ================= INIT FORM =================
  initForm(): void {
    this.planForm = new FormGroup({
      planName: new FormControl(''),
      price: new FormControl(0),
      studentLimit: new FormControl(0),
      description: new FormControl(''),
      isActive: new FormControl(true)
    });
  }

  // ================= LOAD ALL PLANS =================
  loadPlans(): void {
    console.log("🔥 API CALL STARTED: getAllPlans");

    this.planService.getAllPlans().subscribe({
      next: (res) => {
        console.log("✅ API RESPONSE:", res);
        this.plans = res;
      },
      error: (err) => {
        console.log("❌ API ERROR:", err);
        this.messageService.showError('Failed to load plans');
      }
    });
  }

  // ================= VALIDATION =================
  private isValidPlan(): boolean {
    const form = this.planForm.value;

    if (!form.planName?.trim()) {
      this.messageService.showError('Plan name is required');
      return false;
    }
    if (form.price <= 0) {
      this.messageService.showError('Price must be greater than 0');
      return false;
    }
    if (form.studentLimit <= 0) {
      this.messageService.showError('Student limit must be greater than 0');
      return false;
    }
    return true;
  }

  // ================= SAVE PLAN =================
  savePlan(): void {
    if (!this.isValidPlan()) return;

    this.submitting = true;

    const payload: PlanRequestDTO = this.planForm.value;

    if (this.selectedPlanId) {
      this.updatePlan(payload);
    } else {
      this.createPlan(payload);
    }
  }

  // ================= CREATE PLAN =================
  createPlan(payload: PlanRequestDTO): void {
    this.planService.createPlan(payload).subscribe({
      next: () => {
        this.messageService.showSuccess('Plan created successfully');
        this.resetForm();
        this.loadPlans();
        this.submitting = false;
      },
      error: () => {
        this.messageService.showError('Failed to create plan');
        this.submitting = false;
      }
    });
  }

  // ================= EDIT PLAN =================
  editPlan(p: PlanResponseDTO): void {
    this.selectedPlanId = p.id!;

    this.planForm.patchValue({
      planName: p.planName,
      price: p.price,
      studentLimit: p.studentLimit,
      description: p.description,
      isActive: p.isActive
    });
  }

  // ================= UPDATE PLAN =================
  updatePlan(payload: PlanRequestDTO): void {
    this.planService.updatePlan(this.selectedPlanId!, payload).subscribe({
      next: () => {
        this.messageService.showSuccess('Plan updated successfully');
        this.resetForm();
        this.loadPlans();
        this.submitting = false;
      },
      error: () => {
        this.messageService.showError('Failed to update plan');
        this.submitting = false;
      }
    });
  }

  // ================= DELETE PLAN =================
  deletePlan(id: number): void {
    if (confirm('Are you sure you want to delete this plan?')) {
      this.loading = true;

      this.planService.deletePlan(id).subscribe({
        next: () => {
          this.messageService.showSuccess('Plan deleted successfully');
          this.loadPlans();
          this.loading = false;
        },
        error: () => {
          this.messageService.showError('Failed to delete plan');
          this.loading = false;
        }
      });
    }
  }

  // ================= RESET FORM =================
  resetForm(): void {
    this.planForm.reset({
      planName: '',
      price: 0,
      studentLimit: 0,
      description: '',
      isActive: true
    });

    this.selectedPlanId = null;
    this.submitting = false;
  }

  // ================= CANCEL =================
  cancelEdit(): void {
    this.resetForm();
  }

  // ================= BUTTON TEXT =================
  getButtonText(): string {
    return this.selectedPlanId ? 'Update Plan' : 'Create Plan';
  }

  get isEditMode(): boolean {
    return !!this.selectedPlanId;
  }
}