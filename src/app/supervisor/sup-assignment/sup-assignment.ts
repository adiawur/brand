import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  AssignmentService,
  Assignment
} from '../../services/assignment.service';

import {
  UserService,
  User
} from '../../services/user.service';

@Component({
  selector: 'app-sup-assignment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './sup-assignment.html',
  styleUrls: ['./sup-assignment.css']
})
export class SupAssignment implements OnInit {

  assignments: Assignment[] = [];

  technicians: User[] = [];

  loading = false;

  errorMessage = '';

  successMessage = '';

  // ---------------------------------------------
  // REASSIGN MODAL
  // ---------------------------------------------

  showReassignModal = false;

  selectedAssignment: Assignment | null = null;

  selectedTechnicianId: number | null = null;

  reassigning = false;


  constructor(
    private assignmentService: AssignmentService,
    private userService: UserService,
    
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    this.loadAssignments();

    this.loadTechnicians();

  }


  // =============================================
  // LOAD ASSIGNMENTS
  // =============================================

  loadAssignments(): void {

    this.loading = true;

    this.errorMessage = '';

    this.assignmentService
      .getAll()
      .subscribe({

        next: (data) => {

          this.assignments = data;

          this.loading = false;
          
          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(error);

          this.errorMessage =
            error?.error?.message ||
            'Failed to load assignments';

          this.loading = false;

        }

      });

  }


  // =============================================
  // LOAD TECHNICIANS
  // =============================================

  loadTechnicians(): void {

    this.userService
      .getSupervisorTechnicians()
      .subscribe({

        next: (data) => {

          this.technicians = data;
          
          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Failed to load technicians',
            error
          );

        }

      });

  }


  // =============================================
  // OPEN REASSIGN MODAL
  // =============================================

  openReassign(
    assignment: Assignment
  ): void {

    this.selectedAssignment = assignment;

    this.selectedTechnicianId = null;

    this.showReassignModal = true;

  }


  // =============================================
  // CLOSE REASSIGN MODAL
  // =============================================

  closeReassign(): void {

    this.showReassignModal = false;

    this.selectedAssignment = null;

    this.selectedTechnicianId = null;

  }


  // =============================================
  // REASSIGN
  // =============================================

  reassign(): void {

    if (
      !this.selectedAssignment ||
      !this.selectedTechnicianId
    ) {

      return;

    }

    this.reassigning = true;

    this.errorMessage = '';

    this.successMessage = '';


    this.assignmentService
      .reassign(
        this.selectedAssignment.id,
        this.selectedTechnicianId
      )
      .subscribe({

        next: () => {

          this.reassigning = false;

          this.showReassignModal = false;

          this.selectedAssignment = null;

          this.selectedTechnicianId = null;

          this.successMessage =
            'Incident successfully reassigned.';

          this.loadAssignments();

        },

        error: (error) => {

          console.error(error);

          this.reassigning = false;

          this.errorMessage =
            error?.error?.message ||
            'Failed to reassign incident.';

        }

      });

  }


  // =============================================
  // STATUS
  // =============================================

  getStatusClass(
    assignment: Assignment
  ): string {

    const status =
      assignment.status?.toUpperCase();

    switch (status) {

      case 'ASSIGNED':
        return 'status-assigned';

      case 'IN_PROGRESS':
        return 'status-progress';

      case 'COMPLETED':
        return 'status-completed';

      case 'RESOLVED':
        return 'status-resolved';

      default:
        return 'status-default';

    }

  }


  // =============================================
  // FORMAT STATUS
  // =============================================

  formatStatus(
    status?: string
  ): string {

    if (!status) {
      return 'Unknown';
    }

    return status
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, char =>
        char.toUpperCase()
      );

  }


  // =============================================
  // TRACK BY
  // =============================================

  trackById(
    index: number,
    item: Assignment
  ): number {

    return item.id;

  }

}