import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sup-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './sup-layout.html',
  styleUrl: './sup-layout.css',
})
export class SupLayout {

  sidebarCollapsed = false;

  mobileSidebar = false;

  today = new Date();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}


  // =========================================================
  // DESKTOP SIDEBAR
  // =========================================================

  toggleSidebar(): void {

    this.sidebarCollapsed =
      !this.sidebarCollapsed;

  }


  // =========================================================
  // MOBILE SIDEBAR
  // =========================================================

  toggleMobileSidebar(): void {

    this.mobileSidebar =
      !this.mobileSidebar;

  }


  // =========================================================
  // LOGOUT
  // =========================================================

  logout(): void {

    const confirmed =
      window.confirm(
        'Are you sure you want to logout?'
      );

    if (!confirmed) {
      return;
    }

    this.authService.logout();

    this.router.navigate([
      '/login'
    ]);

  }

}