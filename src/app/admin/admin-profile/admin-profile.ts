import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  User,
  UserService
} from '../../services/user.service';

import {
  AlertService
} from '../../services/alert.service';

import {
  AuthService
} from '../../services/auth.service';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './admin-profile.html',
  styleUrl: './admin-profile.css'
})
export class AdminProfile implements OnInit {

  editMode = false;

  loading = false;

  admin: User | null = null;

  constructor(
    private userService: UserService,
    private alertService: AlertService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.loadProfile();

  }

  loadProfile(): void {

    const userId =
      this.authService.getUserId();

    if (!userId) {

      this.alertService.error(
        'Profile Error',
        'Unable to identify the logged-in user.'
      );

      return;
    }

    this.loading = true;

    this.userService
      .getById(userId)
      .subscribe({

        next: (user) => {

          this.admin = user;

          this.loading = false;

          this.cdr.detectChanges();

        },

        error: (error) => {

          this.loading = false;

          this.alertService.error(
            'Profile Error',
            error?.error?.message ||
            'Unable to load your profile.'
          );

        }

      });

  }

  toggleEdit(): void {

    this.editMode =
      !this.editMode;

  }

  saveProfile(): void {

    if (!this.admin) {
      return;
    }

    if (
      !this.admin.fullName.trim() ||
      !this.admin.username.trim() ||
      !this.admin.email.trim() ||
      !this.admin.phone.trim()
    ) {

      this.alertService.warning(
        'Missing Information',
        'Please fill in all required fields.'
      );

      return;
    }

    this.loading = true;

    const data = {

      fullName:
        this.admin.fullName,

      username:
        this.admin.username,

      email:
        this.admin.email,

      phone:
        this.admin.phone,

      role:
        this.admin.role,

      specialization:
        this.admin.specialization,

      zone:
        this.admin.zone

    };

    this.userService
      .update(
        this.admin.id,
        data
      )
      .subscribe({

        next: (updatedUser) => {

          this.admin =
            updatedUser;

          this.editMode =
            false;

          this.loading =
            false;

          this.cdr.detectChanges();

          this.alertService.success(
            'Profile Updated',
            'Your profile has been updated successfully.'
          );

        },

        error: (error) => {

          this.loading = false;

          this.alertService.error(
            'Update Failed',
            error?.error?.message ||
            'Unable to update your profile.'
          );

        }

      });

  }

  getProfileImage(): string {

    return this.admin?.imageUrl ||
      '/img/admin.png';

  }

}