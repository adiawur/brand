import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-tech-layout',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './tech-layout.html',
  styleUrl: './tech-layout.css',
})
export class TechLayout {

  constructor(
    private authService:AuthService,
    private router:Router
  ){}

  sidebarCollapsed = false;
  mobileSidebarOpen = false;

    toggleSidebar() {
    this.sidebarCollapsed =
    !this.sidebarCollapsed;
  }

  toggleMobileSidebar() {
    this.mobileSidebarOpen = !this.mobileSidebarOpen;
  }

  closeMobileSidebar() {
    this.mobileSidebarOpen = false;
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}