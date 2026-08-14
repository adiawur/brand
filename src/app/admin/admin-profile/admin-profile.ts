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
  UserService,
  UpdateUserRequest
} from '../../services/user.service';

import {
  AlertService
} from '../../services/alert.service';


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
    private cdr: ChangeDetectorRef
  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.loadProfile();

  }


  // =====================================================
  // LOAD MY PROFILE
  // =====================================================

  loadProfile(): void {

    this.loading = true;

    this.userService
      .getMyProfile()
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


  // =====================================================
  // EDIT
  // =====================================================

  toggleEdit(): void {

    this.editMode =
      !this.editMode;

  }


  // =====================================================
  // SAVE
  // =====================================================

  saveProfile(): void {

    if (!this.admin) {
      return;
    }


    // ---------------------------------------------------
    // VALIDATION
    // ---------------------------------------------------

    if (
      !this.admin.fullName?.trim() ||
      !this.admin.username?.trim() ||
      !this.admin.email?.trim() ||
      !this.admin.phone?.trim()
    ) {

      this.alertService.warning(
        'Missing Information',
        'Please fill in all required fields.'
      );

      return;
    }


    this.loading = true;


    const data: UpdateUserRequest = {

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
        this.admin.zone,

      imageUrl:
        this.admin.imageUrl

    };


    this.userService
      .updateMyProfile(data)
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


  // =====================================================
  // PROFILE IMAGE
  // =====================================================

  getProfileImage(): string {

    if (
      this.admin?.imageUrl
    ) {

      return this.getImageUrl(
        this.admin.imageUrl
      );

    }

    return '/img/admin.png';

  }


  // =====================================================
  // IMAGE URL
  // =====================================================

  private getImageUrl(
    imageUrl: string
  ): string {

    if (
      imageUrl.startsWith('http')
    ) {

      return imageUrl;

    }

    return `http://localhost:8182${imageUrl}`;

  }

}