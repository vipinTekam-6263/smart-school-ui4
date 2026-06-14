import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionService } from '../services/subscription.service';
import { SubscriptionResponseDTO } from 'app/models/auth/response/SubscriptionResponseDTO';
import { SubscriptionRequestDTO } from 'app/models/auth/request/SubscriptionRequestDTO';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleType } from 'app/models/enums/role-type.enum';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit, OnDestroy {

  subscriptions: SubscriptionResponseDTO[] = [];
  subscriptionForm: FormGroup;

  loading = false;
  submitting = false;

  message = '';
  messageType: 'success' | 'error' | '' = '';

  userRole: RoleType | '' = '';
  RoleType = RoleType; // ✅ IMPORTANT (HTML access)

  editingId: number | null = null;
  selectedPlan: number | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private subscriptionService: SubscriptionService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {

    this.subscriptionForm = this.fb.group({
      schoolId: [null, [Validators.required, Validators.min(1)]],
      planId: [null, [Validators.required, Validators.min(1)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      status: ['ACTIVE', Validators.required]
    }, {
      validators: this.dateValidator
    });
  }

  ngOnInit(): void {

    // 🔥 ROLE LOAD
    this.userRole = localStorage.getItem('role') as RoleType;

    // 🔥 PLAN FROM LANDING PAGE
    this.route.queryParams.subscribe(params => {
      this.selectedPlan = +params['plan'] || null;

      if (this.selectedPlan) {
        this.subscriptionForm.patchValue({
          planId: this.selectedPlan
        });
      }
    });

    // 🔥 IMPORTANT FIX (NO DUPLICATE CALL)
    if (this.isAdmin()) {
      this.loadSubscriptions();
    } else {
      this.subscriptions = []; // ❌ clear data
    }
  }

  // ✅ ADMIN CHECK
  isAdmin(): boolean {
    return this.userRole === RoleType.SUPER_ADMIN ||
           this.userRole === RoleType.DISTRICT_ADMIN;
  }

  // 🔥 LOAD DATA (SAFE)
  loadSubscriptions() {

    if (!this.isAdmin()) return; // ❌ stop non-admin access

    this.loading = true;

    this.subscriptionService.getAllSubscriptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => this.subscriptions = res,
        error: (err) => this.handleError(err, 'Failed to load subscriptions'),
        complete: () => this.loading = false
      });
  }

  // 🔥 SAVE
  saveSubscription() {
    if (this.subscriptionForm.invalid) {
      this.showMessage('Please fill valid data', 'error');
      return;
    }

    this.submitting = true;

    const formData: SubscriptionRequestDTO = this.subscriptionForm.value;

    const request$ = this.editingId
      ? this.subscriptionService.updateSubscription(this.editingId, formData)
      : this.subscriptionService.createSubscription(formData);

    request$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {

          if (this.editingId) {
            const index = this.subscriptions.findIndex(s => s.id === this.editingId);
            if (index !== -1) this.subscriptions[index] = res;
            this.showMessage('Updated successfully', 'success');
          } else {
            this.subscriptions = [...this.subscriptions, res];
            this.showMessage('Created successfully', 'success');
          }

          this.resetForm();
        },
        error: (err) => this.handleError(err, 'Save failed'),
        complete: () => {
          this.submitting = false;
          this.editingId = null;
        }
      });
  }

  // 🔥 DELETE
  deleteSubscription(id: number) {

    if (!this.isAdmin()) return;

    if (!confirm('Delete this subscription?')) return;

    this.subscriptionService.deleteSubscription(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.subscriptions = this.subscriptions.filter(s => s.id !== id);
          this.showMessage('Deleted successfully', 'success');
        },
        error: (err) => this.handleError(err, 'Delete failed')
      });
  }

  // 🔥 BACK
  goBack() {
    this.router.navigate(['/']);
  }

  // 🔥 UTIL
  resetForm() {
    this.subscriptionForm.reset({
      schoolId: null,
      planId: null,
      startDate: '',
      endDate: '',
      status: 'ACTIVE'
    });

    this.editingId = null;
    this.clearMessage();
  }

  dateValidator(group: FormGroup) {
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;
    return start && end && start > end ? { dateInvalid: true } : null;
  }

  get f() {
    return this.subscriptionForm.controls;
  }

  showMessage(msg: string, type: 'success' | 'error') {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => this.clearMessage(), 3000);
  }

  clearMessage() {
    this.message = '';
    this.messageType = '';
  }

  handleError(err: any, fallback: string) {
    console.error(err);
    this.showMessage(err?.error?.message || fallback, 'error');
  }

  trackById(index: number, item: SubscriptionResponseDTO) {
    return item.id!;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  editSubscription(subscription: SubscriptionResponseDTO) {
  this.editingId = subscription.id!;

  this.subscriptionForm.patchValue({
    schoolId: subscription.schoolId,
    planId: subscription.planId,
    startDate: subscription.startDate || '',
    endDate: subscription.endDate || '',
    status: subscription.status || 'ACTIVE'
  });

  this.showMessage('Edit mode', 'success');
}
}