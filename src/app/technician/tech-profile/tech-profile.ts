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
  selector: 'app-tech-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './tech-profile.html',
  styleUrl: './tech-profile.css',
})
export class TechProfile implements OnInit {

  // =========================================================
  // STATE
  // =========================================================

  editMode = false;

  loading = false;

  saving = false;

  technician: any = {

    id: null,

    fullName: '',

    username: '',

    email: '',

    phone: '',

    role: '',

    specialization: '',

    zone: '',

    imageUrl: null,

    active: false

  };


  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
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
  // LOAD PROFILE
  // =========================================================

  loadProfile(): void {

    this.loading = true;

    this.userService
      .getMyProfile()
      .subscribe({

        next: (user: User) => {

          this.technician = {
            ...user
          };

          this.loading = false;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Failed to load technician profile:',
            error
          );

          this.loading = false;

          this.cdr.detectChanges();

        }

      });

  }


  // =========================================================
  // EDIT
  // =========================================================

  toggleEdit(): void {

    this.editMode =
      !this.editMode;

  }


  // =========================================================
  // SAVE PROFILE
  // =========================================================

  saveProfile(): void {

    this.saving = true;


    const data: UpdateUserRequest = {

      fullName:
        this.technician.fullName,

      username:
        this.technician.username,

      email:
        this.technician.email,

      phone:
        this.technician.phone,

      role:
        this.technician.role,

      specialization:
        this.technician.specialization,

      zone:
        this.technician.zone,

      imageUrl:
        this.technician.imageUrl

    };


    this.userService
      .updateMyProfile(data)
      .subscribe({

        next: (user: User) => {

          this.technician = {
            ...user
          };

          this.editMode = false;

          this.saving = false;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Failed to update profile:',
            error
          );

          this.saving = false;

          this.cdr.detectChanges();

        }

      });

  }


  // =========================================================
  // CANCEL
  // =========================================================

  cancelEdit(): void {

    this.editMode = false;

    this.loadProfile();

  }


  // =========================================================
  // PASSWORD
  // =========================================================

  updatePassword(): void {

    /*
     * Password endpoint haijapewa
     * kwenye backend yako kwa sasa.
     */

    console.warn(
      'Password update endpoint is not implemented yet.'
    );

  }


  // =========================================================
  // AVAILABILITY
  // =========================================================

  get availabilityStatus(): string {

    return this.technician.active
      ? 'Available'
      : 'Offline';

  }


  // =========================================================
  // IMAGE
  // =========================================================

  get profileImage(): string {

    return this.technician.imageUrl
      || '/img/default-user.png';

  }

}