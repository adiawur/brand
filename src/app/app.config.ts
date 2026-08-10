import { ApplicationConfig } from '@angular/core';
import { provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { LucideAngularModule } from 'lucide-angular';

import {
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  BarChart3,
  Home,
  Bell,
  Shield,
  ChartColumn,
  Facebook,
  Instagram,
  Twitter,
  Linkedin
} from 'lucide-angular';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './services/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        authInterceptor
      ])
    )
  ],
};