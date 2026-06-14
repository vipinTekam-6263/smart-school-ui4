import { Routes } from '@angular/router';

import { LoginComponent } from './features/auth/login/login.component';
import { ClassListComponent } from './features/classes/pages/class-list/class-list.component';
import { DashboardComponent } from './features/dashboard/dashboard/dashboard.component';
import { StudentDashboardComponent } from './features/students/student-dashboard/student-dashboard.component';
import { StudentListComponent } from './features/students/student-list/student-list.component';

/* TEACHER */
import { TeacherDashboardComponent } from './features/users/teacher-dashboard/teacher-dashboard/teacher-dashboard.component';
import { TeacherAttendanceComponent } from './features/users/teacher-dashboard/Teacher-attendance/teacher-attendance/teacher-attendance.component';

/* PARENT */
import { DashboardComponent as ParentDashboardComponent } 
from './features/users/parent-dashboard/dashboard/dashboard.component';
import { HomeworkListComponent } from './features/users/parent-dashboard/homework-list/homework-list.component';

/* SUPER ADMIN */
import { SuperadminDashboardComponent } from './features/users/super-admin/superadmin-dashboard/superadmin-dashboard.component';
import { StateListComponent } from './features/users/super-admin/state-list/state-list.component';
import { RevenueComponent } from './features/users/super-admin/revenue/revenue.component';
import { PlanComponent } from './features/users/super-admin/plan/plan.component';
import { SubscriptionComponent } from './features/users/super-admin/subscription/subscription.component';
/* STATE ADMIN */
import { StateadminDashboardComponent } from './features/users/state-admin/stateadmin-dashboard/stateadmin-dashboard.component';

/* DISTRICT ADMIN */
import { DistrictadminDashboardComponent } from './features/users/district-admin/districtadmin-dashboard/districtadmin-dashboard.component';
import { DistrictListComponent } from './features/district/district-list/district-list.component';

/* SCHOOL ADMIN */
import { SchooladminDashboardComponent } from './features/users/school-admin/schooladmin-dashboard/schooladmin-dashboard.component';
import { SchoolListComponent } from './features/schools/school-list/school-list.component';
import { AttendanceListComponent } from './features/users/school-admin/attendance/attendance-list/attendance-list.component';
import { TeacherListComponent } from './features/teachers/teacher-list/teacher-list.component';
import { AdminHomeworkComponent } from './features/users/school-admin/homework/homework-list/homework-list.component';
import { NoticeListComponent } from './features/users/school-admin/notice/notice-list/notice-list.component';
import { ExamComponent } from './features/users/school-admin/Exam/exam.component';
import { TeacherClassAssignComponent } from './features/users/school-admin/teacher-class-assign/features/users/school-admin/teacher-class-assign/teacher-class-assign.component';
/* LANDING PAGE (ADDED) */
import { LandingPageComponent } from './features/landing/landing-page/landing-page.component';

/* GUARD */
import { AuthGuard } from './core/guards/auth.guard';
import { authGuard } from '@env/core/guards/auth.guard';

export const routes: Routes = [

  /* LANDING PAGE (NEW DEFAULT) */
  { path: '', component: LandingPageComponent },

  /* LOGIN */
  { path: 'auth/login', component: LoginComponent },

  /* STUDENT */
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['STUDENT'] }
  },
  {
    path: 'student-dashboard',
    component: StudentDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['STUDENT'] }
  },

  {
    path: 'students',
    component: StudentListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SCHOOL_ADMIN'] }
  },

  /* PARENT */
  {
    path: 'parent-dashboard',
    component: ParentDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['PARENT'] }
  },
  {
    path: 'homework-list',
    component: HomeworkListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['PARENT', 'TEACHER'] }
  },

  /* TEACHER */
  {
    path: 'teacher-dashboard',
    component: TeacherDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['TEACHER'] }
  },
  {
    path: 'teachers',
    component: TeacherListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SCHOOL_ADMIN', 'SUPER_ADMIN'] }
  },
  {
    path: 'teacher-attendance',
    component: TeacherAttendanceComponent,
    canActivate: [AuthGuard],
    data: { roles: ['TEACHER'] }
  },

  /* SUPER ADMIN */
  {
    path: 'superadmin-dashboard',
    component: SuperadminDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPER_ADMIN'] }
  },
  {
    path: 'state-list',
    component: StateListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPER_ADMIN'] }
  },

  /* STATE ADMIN */
  {
    path: 'stateadmin-dashboard',
    component: StateadminDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['STATE_ADMIN'] }
  },

 {
  path: 'super-admin/revenue',
  component: RevenueComponent,
  canActivate: [AuthGuard],
  data: { roles: ['SUPER_ADMIN'] }
},

{
  path:'super-admin/plan',
  component:PlanComponent,
  canActivate:[AuthGuard],
  data:{roles:['SUPER_ADMIN']}
},
{
  path:'super-admin/subscription',
  component:SubscriptionComponent,
  canActivate:[authGuard],
  data:{roles:['SUPER_ADMIN','DISTRICT_ADMIN']}
},
  /* DISTRICT ADMIN */
  {
    path: 'districtadmin-dashboard',
    component: DistrictadminDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['DISTRICT_ADMIN'] }
  },
  {
    path: 'district-list',
    component: DistrictListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPER_ADMIN', 'DISTRICT_ADMIN'] }
  },

  /* SCHOOL ADMIN */
  {
    path: 'schooladmin-dashboard',
    component: SchooladminDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SCHOOL_ADMIN'] }
  },
  {
    path: 'school-list',
    component: SchoolListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SUPER_ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'] }
  },
  {
    path: 'classes',
    component: ClassListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SCHOOL_ADMIN'] }
  },
  {
    path: 'attendance',
    component: AttendanceListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SCHOOL_ADMIN'] }
  },
  {
    path: 'school-admin/homework',
    component: AdminHomeworkComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SCHOOL_ADMIN'] }
  },
  {
    path: 'school-admin/notice',
    component: NoticeListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['SCHOOL_ADMIN'] }
  },
  {
    path: 'school-admin/Exam',
    component: ExamComponent,
    canActivate: [authGuard],
    data: { roles: ['SCHOOL_ADMIN'] }
  },
  {
    path:'school-admin/teacher-class-assign',
    component:TeacherClassAssignComponent,
    canActivate:[authGuard],
    data:{roles:['SCHOOL_ADMIN']}
  },

  /* DEFAULT */
  { path: '**', redirectTo: '' }
];