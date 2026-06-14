import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SuperAdminService } from '../services/super-admin.service';
import { Router } from '@angular/router';  

@Component({
  selector: 'app-superadmin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './superadmin-dashboard.component.html',
  styleUrls: ['./superadmin-dashboard.component.css']
})
export class SuperadminDashboardComponent implements OnInit {

  currentTime: string = '';
  totalStateTarget = 0;
  totalDistrictTarget = 0;
  totalSchoolTarget = 0;
  revenueTarget = 0;
  activeUserTarget = 0;

  totalState = 0;
  totalDistrict = 0;
  totalSchool = 0;
  revenue = 0;
  activeUser = 0;
  plans: any[] = [];
  subscriptions: any[] = [];

  menuItems: string[] = ['Dashboard','Total State','Total District','Total School','Revenue','Plan','Subscription','Active User'];
  activeMenu: string = 'Dashboard';

  notifications: string[] = [
    'New district added',
    'New school registered',
    'Revenue updated',
    'User activity increased',
    'System maintenance scheduled',
    'Admin meeting at 5 PM'
  ];

  constructor(
    private dashboardService: SuperAdminService,
    private router: Router
  ) {}

  ngOnInit() {
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);

    this.loadDashboardCounts();
    this.scrollNotifications();
  }

  goToStateDashboard() {
    this.router.navigate(['/state-list']);
  }

  goToDistrictDashboard() {
    this.router.navigate(['/district-list']);
  }
  goToSchoolDashboard(){
    this.router.navigate(['/school-list'])
  }

  updateTime() {
    this.currentTime = new Date().toLocaleTimeString();
  }

  setActive(menu: string) {
    this.activeMenu = menu;
    if (menu === 'Total State') this.router.navigate(['/state-list']);
    if (menu === 'Total District') this.router.navigate(['/district-list']);
    if(menu ==='Total School')this.router.navigate(['/school-list']);
  }

  loadDashboardCounts() {
    this.dashboardService.getDashboardCounts().subscribe({
      next: (res: any) => {
        this.totalStateTarget = res.totalState;
        this.totalDistrictTarget = res.totalDistrict;
        this.totalSchoolTarget = res.totalSchool;
        this.revenueTarget = res.revenue;
        this.activeUserTarget = res.activeUser;
        this.animateCounters();
      },
      error: (err: any) => {
        console.error("Failed to load dashboard counts:", err);
      }
    });
  }

  animateCounters() {
    this.totalState = 0;
    this.totalDistrict = 0;
    this.totalSchool = 0;
    this.revenue = 0;
    this.activeUser = 0;

    const interval = setInterval(() => {
      if (this.totalState < this.totalStateTarget) this.totalState++;
      if (this.totalDistrict < this.totalDistrictTarget) this.totalDistrict++;
      if (this.totalSchool < this.totalSchoolTarget) this.totalSchool += 2;
      if (this.revenue < this.revenueTarget) this.revenue += Math.ceil(this.revenueTarget / 200);
      if (this.activeUser < this.activeUserTarget) this.activeUser += Math.ceil(this.activeUserTarget / 100);

      if (
        this.totalState >= this.totalStateTarget &&
        this.totalDistrict >= this.totalDistrictTarget &&
        this.totalSchool >= this.totalSchoolTarget &&
        this.revenue >= this.revenueTarget &&
        this.activeUser >= this.activeUserTarget
      ) {
        clearInterval(interval);
      }
    }, 30);
  }

  scrollNotifications() {
    setInterval(() => {
      if (this.notifications.length > 0) {
        const first = this.notifications.shift();
        if (first) this.notifications.push(first);
      }
    }, 5000);
  }


  logout() {
  // 1. Clear authentication data
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.clear();

  // 2. Optional: clear any interval if needed (safe cleanup)
  // (future me agar interval reference store karo to yaha clear karna)

  // 3. Redirect to login page
  this.router.navigate(['/login']);
}

goToRevenue() {
  this.router.navigate(['/super-admin/revenue']);
}
goToPlan(){
  this.router.navigate(['/super-admin/plan']);
}
goToSubscription(){
  this.router.navigate(['/super-admin/subscription'])
}
}