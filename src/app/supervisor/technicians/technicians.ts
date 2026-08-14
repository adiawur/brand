import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  User,
  UserService
} from '../../services/user.service';

import {
  AlertService
} from '../../services/alert.service';

@Component({
  selector: 'app-technicians',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './technicians.html',
  styleUrl: './technicians.css',
})
export class Technicians implements OnInit {

  technicians: User[] = [];

  selectedTechnician: User | null = null;

  showViewModal = false;

  searchTerm = '';

  loading = false;

  constructor(
    private userService: UserService,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.loadTechnicians();

  }

  loadTechnicians(): void {

    this.loading = true;

    this.userService
      .getTechnicians()
      .subscribe({

        next: (technicians) => {

          this.technicians = technicians;

          this.loading = false;
          this.cdr.detectChanges();

        },

        error: (error) => {

          this.loading = false;

          this.alertService.error(
            'Operation Failed',
            this.getErrorMessage(
              error,
              'Unable to load technicians.'
            )
          );

        }

      });

  }

  get filteredTechnicians(): User[] {

    const search =
      this.searchTerm
        .toLowerCase()
        .trim();

    if (!search) {

      return this.technicians;

    }

    return this.technicians.filter(
      technician =>

        technician.fullName
          .toLowerCase()
          .includes(search) ||

        technician.username
          .toLowerCase()
          .includes(search) ||

        technician.email
          .toLowerCase()
          .includes(search) ||

        technician.phone
          .toLowerCase()
          .includes(search) ||

        technician.zone
          ?.toLowerCase()
          .includes(search) ||

        technician.specialization
          ?.toLowerCase()
          .includes(search)

    );

  }

  openViewModal(
    technician: User
  ): void {

    this.selectedTechnician = technician;

    this.showViewModal = true;

  }

  closeViewModal(): void {

    this.showViewModal = false;

    this.selectedTechnician = null;

  }

  private getErrorMessage(
    error: any,
    fallback: string
  ): string {

    if (error?.error?.message) {

      return error.error.message;

    }

    if (
      typeof error?.error === 'string'
    ) {

      return error.error;

    }

    return fallback;

  }

}