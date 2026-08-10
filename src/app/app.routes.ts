import { Routes } from '@angular/router';

import { Home } from './public/home/home';
import { Login } from './auth/login/login';
import { Report } from './public/report/report';

import { AdminLayout } from './admin/admin-layout/admin-layout';
import { AdminDashboard } from './admin/admin-dashboard/admin-dashboard';
import { Users } from './admin/users/users';
import { AdminIncidents } from './admin/admin-incidents/admin-incidents';
import { AdminNotifications } from './admin/admin-notifications/admin-notifications';
import { AdminReports } from './admin/admin-reports/admin-reports';
import { AdminProfile } from './admin/admin-profile/admin-profile';

import { SupDashboard } from './supervisor/sup-dashboard/sup-dashboard';
import { Technicians } from './supervisor/technicians/technicians';
import { SupNotifications } from './supervisor/sup-notifications/sup-notifications';
import { SupProfile } from './supervisor/sup-profile/sup-profile';
import { SupLayout } from './supervisor/sup-layout/sup-layout';
import { SupIncidents } from './supervisor/sup-incidents/sup-incidents';

import { TechLayout } from './technician/tech-layout/tech-layout';
import { TechDashboard } from './technician/tech-dashboard/tech-dashboard';
import { Assigments } from './technician/assigments/assigments';
import { TechNotifications } from './technician/tech-notifications/tech-notifications';
import { TechProfile } from './technician/tech-profile/tech-profile';


// =========================================================
// GUARDS
// =========================================================

import { authGuard } from './services/auth.guard';
import { roleGuard } from './services/role.guard';


export const routes: Routes = [

  // =========================================================
  // PUBLIC ROUTES
  // =========================================================
  {
    path: '',
    component: Home},

  {
    path: 'login',
    component: Login},

  {
    path: 'report-incident',
    component: Report},


  // =========================================================
  // ADMIN ROUTES
  // =========================================================

  {
    path: 'admin',

    component: AdminLayout,

    canActivate: [
      authGuard,
      roleGuard
    ],

    data: {
      roles: ['ADMIN']
},

    children: [

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
  },

      {
        path: 'dashboard',
        component: AdminDashboard
  },

      {
        path: 'users',
        component: Users
  },

      {
        path: 'incidents',
        component: AdminIncidents
  },

      {
        path: 'notifications',
        component: AdminNotifications
  },

      {
        path: 'reports',
        component: AdminReports
  },

      {
        path: 'profile',
        component: AdminProfile
      }

    ]},


  // =========================================================
  // SUPERVISOR ROUTES
  // =========================================================

  {
    path: 'supervisor',

    component: SupLayout,

    canActivate: [
      authGuard,
      roleGuard
    ],

    data: {
      roles: ['SUPERVISOR']
},

    children: [

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
  },

      {
        path: 'dashboard',
        component: SupDashboard
  },

      {
        path: 'technicians',
        component: Technicians
  },

      {
        path: 'incidents',
        component: SupIncidents
  },

      {
        path: 'notifications',
        component: SupNotifications
  },

      {
        path: 'profile',
        component: SupProfile
      }

    ]},


  // =========================================================
  // TECHNICIAN ROUTES
  // =========================================================

  {
    path: 'technician',

    component: TechLayout,

    canActivate: [
      authGuard,
      roleGuard
    ],

    data: {
      roles: ['TECHNICIAN']
},

    children: [

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
  },

      {
        path: 'dashboard',
        component: TechDashboard
  },

      {
        path: 'assignments',
        component: Assigments
  },

      {
        path: 'notifications',
        component: TechNotifications
  },

      {
        path: 'profile',
        component: TechProfile
      }

    ]
  }

];