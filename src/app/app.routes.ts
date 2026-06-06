import { Routes } from '@angular/router';
import { Home } from './public/home/home';
import { Login } from './auth/login/login';
import { Report } from './public/report/report';
import { Dashboard } from './customer/dashboard/dashboard';
import { CustomerDashboard } from './customer-dashboard/customer-dashboard';

export const routes: Routes = [
    {path: "",component:Home},
    {path: "login",component:Login},
    {path: "report-complain",component:Report},
    {path: "customer",component:CustomerDashboard}
];
