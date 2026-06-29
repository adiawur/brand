import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sup-layout',
  imports: [CommonModule, RouterModule],
  templateUrl: './sup-layout.html',
  styleUrl: './sup-layout.css',
})
export class SupLayout {
  constructor(private router:Router){}

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

  logout() {
    this.router.navigate(['/login']);
}

}
