import {
  CommonModule
} from '@angular/common';

import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  User,
  UserService,
  UpdateUserRequest
} from '../../services/user.service';


@Component({
  selector: 'app-sup-profile',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './sup-profile.html',
  styleUrl: './sup-profile.css'
})
export class SupProfile implements OnInit {

  editMode = false;

  loading = false;

  supervisor: User = {

    id: 0,

    fullName: '',

    username: '',

    email: '',

    phone: '',

    role: '',

    specialization: '',

    zone: '',

    active: true,

    imageUrl: null

  };


  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.loadProfile();

  }


  // =====================================================
  // LOAD PROFILE
  // =====================================================

  loadProfile(): void {

    this.loading = true;

    this.userService
      .getMyProfile()
      .subscribe({

        next: (user) => {

          this.supervisor =
            user;

          this.loading =
            false;

          this.cdr.detectChanges();

        },

        error: (error) => {

          this.loading =
            false;

          console.error(
            'Profile loading error:',
            error
          );

          alert(
            error?.error?.message ||
            'Unable to load profile'
          );

        }

      });

  }


  // =====================================================
  // EDIT MODE
  // =====================================================

  toggleEdit(): void {

    this.editMode =
      !this.editMode;

  }


  // =====================================================
  // SAVE PROFILE
  // =====================================================

  saveProfile(): void {

    if (
      !this.supervisor.fullName?.trim() ||
      !this.supervisor.username?.trim() ||
      !this.supervisor.email?.trim() ||
      !this.supervisor.phone?.trim()
    ) {

      alert(
        'Please fill in all required fields.'
      );

      return;

    }


    this.loading = true;


    const data: UpdateUserRequest = {

      fullName:
        this.supervisor.fullName,

      username:
        this.supervisor.username,

      email:
        this.supervisor.email,

      phone:
        this.supervisor.phone,

      role:
        this.supervisor.role,

      specialization:
        this.supervisor.specialization,

      zone:
        this.supervisor.zone,

      imageUrl:
        this.supervisor.imageUrl

    };


    this.userService
      .updateMyProfile(data)
      .subscribe({

        next: (user) => {

          this.supervisor =
            user;

          this.editMode =
            false;

          this.loading =
            false;

          this.cdr.detectChanges();

          alert(
            'Profile updated successfully'
          );

        },

        error: (error) => {

          this.loading =
            false;

          console.error(
            'Profile update error:',
            error
          );

          alert(
            error?.error?.message ||
            'Unable to update profile'
          );

        }

      });

  }


  // =====================================================
  // PROFILE IMAGE
  // =====================================================

  getProfileImage(): string {

    if (
      this.supervisor.imageUrl
    ) {

      if (
        this.supervisor.imageUrl
          .startsWith('http')
      ) {

        return this.supervisor.imageUrl;

      }

      return `http://localhost:8182${this.supervisor.imageUrl}`;

    }

    return '/img/sup.jfif';

  }


  // =====================================================
  // PASSWORD
  // =====================================================

  updatePassword(): void {

    alert(
      'Password update service is not available yet.'
    );

  }

}