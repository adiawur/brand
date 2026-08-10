import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sup-layout',
  imports: [CommonModule, RouterModule],
  templateUrl: './sup-layout.html',
  styleUrl: './sup-layout.css',
})
export class SupLayout {
  constructor(
      private authService:AuthService,
      private router:Router
    ){}

  sidebarCollapsed = false;
  mobileSidebar = false;

  toggleSidebar() {
    this.sidebarCollapsed =
    !this.sidebarCollapsed;
  }

  toggleMobileSidebar() {
    this.mobileSidebar =
    !this.mobileSidebar;
  }

  logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
