import {
  CommonModule
} from '@angular/common';

import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  Router,
  RouterModule
} from '@angular/router';

import {
  AuthService
} from '../../services/auth.service';

import {
  User,
  UserService
} from '../../services/user.service';


@Component({
  selector: 'app-tech-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './tech-layout.html',
  styleUrl: './tech-layout.css',
})
export class TechLayout implements OnInit {

  // =========================================================
  // SIDEBAR
  // =========================================================

  sidebarCollapsed = false;

  mobileSidebarOpen = false;


  // =========================================================
  // USER
  // =========================================================

  technician: User | null = null;

  loadingProfile = true;


  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    this.loadProfile();

  }


  // =========================================================
  // LOAD LOGGED-IN USER
  // =========================================================

  loadProfile(): void {

    this.userService
      .getMyProfile()
      .subscribe({

        next: (user: User) => {

          this.technician = user;

          this.loadingProfile = false;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Failed to load logged-in technician:',
            error
          );

          this.loadingProfile = false;

          this.cdr.detectChanges();

        }

      });

  }


  // =========================================================
  // SIDEBAR
  // =========================================================

  toggleSidebar(): void {

    this.sidebarCollapsed =
      !this.sidebarCollapsed;

  }


  toggleMobileSidebar(): void {

    this.mobileSidebarOpen =
      !this.mobileSidebarOpen;

  }


  closeMobileSidebar(): void {

    this.mobileSidebarOpen = false;

  }


  // =========================================================
  // LOGOUT
  // =========================================================

  logout(): void {

    this.authService.logout();

    this.router.navigate([
      '/login'
    ]);

  }


  // =========================================================
  // PROFILE IMAGE
  // =========================================================

  get profileImage(): string {

    return this.technician?.imageUrl
      || '/img/default-user.png';

  }

}