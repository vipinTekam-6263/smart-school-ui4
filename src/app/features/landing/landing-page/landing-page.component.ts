import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LandingPageService } from '../service/landing_pageService';
import { MessageService } from 'app/shared/message.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  activeSchools: number = 0;
  students: number = 0;
  loading: boolean = false;

  searchQuery: string = '';

  constructor(
    private router: Router,
    private landingService: LandingPageService,
    public messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  // ================= LOAD STATS =================
  loadStats(): void {
    this.loading = true;

    this.landingService.getActiveSchoolsCount().subscribe({
      next: (res) => {
        this.activeSchools = res.activeSchools;
      },
      error: () => {
        this.messageService.showError('Failed to load schools');
      }
    });

    this.landingService.getStudentCount().subscribe({
      next: (res) => {
        this.students = res.totalStudents;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.showError('Failed to load students');
      }
    });
  }

  // ================= SIMPLE NAVIGATION =================
  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  goToGetStarted(): void {
    this.router.navigate(['/auth/login']);
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // ================= SEARCH (optional UI only) =================
  performSearch(): void {
    console.log('Search:', this.searchQuery);
  }

  onSearch(): void {
    this.performSearch();
  }

  // ================= PRICING BUTTON (DEMO ONLY) =================
  openPricingInfo(plan: string): void {
    this.messageService.showSuccess(
      `You selected ${plan} plan (Demo mode - login required)`
    );

    // optional redirect
    this.router.navigate(['/auth/login']);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}