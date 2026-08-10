import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  Router,
  RouterModule
} from '@angular/router';

import {
  AuthService
} from '../../services/auth.service';

import {
  AlertService
} from '../../services/alert.service';

import {
  UserService
} from '../../services/user.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayout implements OnInit {

  sidebarCollapsed = false;

  mobileSidebar = false;

  currentDate = new Date();

  adminName = 'Administrator';

  adminRole = 'Administrator';

  adminImage = '/img/admin.png';

  constructor(
    private authService: AuthService,
    private alertService: AlertService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.loadAdmin();

  }

  loadAdmin(): void {

    const userId =
      Number(
        localStorage.getItem('userId')
      );

    if (!userId) {
      return;
    }

    this.userService
      .getById(userId)
      .subscribe({

        next: (user) => {

          this.adminName =
            user.fullName;

          this.adminRole =
            user.role;

          this.adminImage =
            user.imageUrl ||
            '/img/admin.png';

        },

        error: () => {}

      });

  }

  toggleSidebar(): void {

    this.sidebarCollapsed =
      !this.sidebarCollapsed;

  }

  toggleMobileSidebar(): void {

    this.mobileSidebar =
      !this.mobileSidebar;

  }

  logout(): void {

    this.alertService
      .confirm(
        'Logout?',
        'Are you sure you want to logout?',
        'Logout'
      )
      .then(confirmed => {

        if (!confirmed) {
          return;
        }

        this.authService.logout();

        this.router.navigate([
          '/login'
        ]);

      });

  }

}