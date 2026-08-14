import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  Assignment,
  AssignmentService
} from '../../services/assignment.service';

import {
  Incident,
  IncidentService
} from '../../services/incident.service';

import {
  AlertService
} from '../../services/alert.service';


interface TechnicianAssignment extends Assignment {

  incident?: Incident;

}


@Component({
  selector: 'app-assigments',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './assigments.html',
  styleUrl: './assigments.css'
})
export class Assigments implements OnInit {


  // =========================================================
  // MODALS
  // =========================================================

  showDetailsModal = false;

  showUpdateModal = false;


  // =========================================================
  // DATA
  // =========================================================

  assignments: TechnicianAssignment[] = [];

  selectedAssignment:
    TechnicianAssignment | null = null;


  // =========================================================
  // COMPLETION
  // =========================================================

  completionNotes = '';

  selectedFile?: File;


  loading = false;

  submitting = false;


  constructor(

    private assignmentService:
      AssignmentService,

    private incidentService:
      IncidentService,

    private alertService:
      AlertService,

    private cdr:
      ChangeDetectorRef

  ) {}


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    this.loadAssignments();

  }


  // =========================================================
  // LOAD ASSIGNMENTS
  // =========================================================

  loadAssignments(): void {

    this.loading = true;

    this.assignmentService
      .getMyAssignments()
      .subscribe({

        next: (assignments) => {

          if (!assignments.length) {

            this.assignments = [];

            this.loading = false;

            this.cdr.detectChanges();

            return;

          }


          /*
           * AssignmentResponse contains incidentId.
           * We fetch the corresponding incident so that
           * technician can see customer, type, priority,
           * location and description.
           */

          const requests =
            assignments.map(assignment =>

              this.incidentService
                .getById(assignment.incidentId)

          );


          /*
           * forkJoin is imported dynamically below.
           */

          import('rxjs').then(({ forkJoin }) => {

            forkJoin(requests)
              .subscribe({

                next: (incidents) => {

                  this.assignments =
                    assignments.map(
                      (assignment, index) => ({

                        ...assignment,

                        incident:
                          incidents[index]

                      })

                    );

                  this.loading = false;

                  this.cdr.detectChanges();

                },

                error: () => {

                  this.loading = false;

                  this.alertService.error(
                    'Loading Failed',
                    'Unable to load assignment details.'
                  );

                }

              });

          });

        },

        error: () => {

          this.loading = false;

          this.alertService.error(
            'Loading Failed',
            'Unable to load your assignments.'
          );

        }

      });

  }


  // =========================================================
  // VIEW DETAILS
  // =========================================================

  openDetails(
    item: TechnicianAssignment
  ): void {

    this.selectedAssignment = item;

    this.showDetailsModal = true;

  }


  closeDetails(): void {

    this.showDetailsModal = false;

    this.selectedAssignment = null;

  }


  // =========================================================
  // MAP
  // =========================================================

  openMap(
    item: TechnicianAssignment
  ): void {

    const incident =
      item.incident;

    if (!incident) {

      this.alertService.warning(
        'Location Unavailable',
        'Incident location is not available.'
      );

      return;

    }


    window.open(

      `https://www.google.com/maps?q=${incident.latitude},${incident.longitude}`,

      '_blank'

    );

  }


  // =========================================================
  // UPDATE / WORK MODAL
  // =========================================================

  openUpdate(
    item: TechnicianAssignment
  ): void {

    this.selectedAssignment = item;

    this.completionNotes = '';

    this.selectedFile = undefined;

    this.showUpdateModal = true;

  }


  closeUpdate(): void {

    this.showUpdateModal = false;

    this.selectedAssignment = null;

    this.completionNotes = '';

    this.selectedFile = undefined;

  }


  // =========================================================
  // START WORK
  // =========================================================

  startWork(): void {

    if (!this.selectedAssignment) {

      return;

    }


    const assignmentId =
      this.selectedAssignment.id;


    this.submitting = true;


    this.assignmentService
      .startWork(assignmentId)
      .subscribe({

        next: () => {

          this.submitting = false;

          this.alertService.success(
            'Work Started',
            'The incident is now in progress.'
          );

          this.closeUpdate();

          this.loadAssignments();

        },

        error: (error) => {

          this.submitting = false;

          this.alertService.error(

            'Unable to Start',

            error?.error?.message ||
            'Unable to start this assignment.'

          );

        }

      });

  }


  // =========================================================
  // FILE SELECT
  // =========================================================

  onFileSelected(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;


    if (
      input.files &&
      input.files.length > 0
    ) {

      this.selectedFile =
        input.files[0];

    }

  }


  // =========================================================
  // COMPLETE WORK
  // =========================================================

  completeWork(): void {

    if (!this.selectedAssignment) {

      return;

    }


    if (
      !this.completionNotes ||
      this.completionNotes.trim() === ''
    ) {

      this.alertService.warning(
        'Completion Notes Required',
        'Please provide work completion notes.'
      );

      return;

    }


    /*
     * We keep photo evidence required
     * as part of technician completion flow.
     */

    if (!this.selectedFile) {

      this.alertService.warning(
        'Photo Evidence Required',
        'Please upload photo evidence before completing the work.'
      );

      return;

    }


    this.submitting = true;


    this.assignmentService
      .completeWork(

        this.selectedAssignment.id,

        this.completionNotes.trim(),

        this.selectedFile

      )
      .subscribe({

        next: () => {

          this.submitting = false;

          this.alertService.success(

            'Work Completed',

            'Assignment completed successfully.'

          );

          this.closeUpdate();

          this.loadAssignments();

        },

        error: (error) => {

          this.submitting = false;

          this.alertService.error(

            'Completion Failed',

            error?.error?.message ||
            'Unable to complete the assignment.'

          );

        }

      });

  }


  // =========================================================
  // FORMAT TYPE
  // =========================================================

  formatType(
    type: string
  ): string {

    if (!type) {

      return '';

    }


    return type

      .replace(/_/g, ' ')

      .toLowerCase()

      .replace(
        /\b\w/g,
        char => char.toUpperCase()
      );

  }


  // =========================================================
  // FORMAT STATUS
  // =========================================================

  formatStatus(
    status: string
  ): string {

    if (!status) {

      return '';

    }


    return status

      .replace(/_/g, ' ')

      .toLowerCase()

      .replace(
        /\b\w/g,
        char => char.toUpperCase()
      );

  }


  // =========================================================
  // FORMAT PRIORITY
  // =========================================================

  formatPriority(
    priority: string
  ): string {

    if (!priority) {

      return '';

    }


    return priority.charAt(0).toUpperCase()
      +
      priority.slice(1).toLowerCase();

  }


  // =========================================================
  // STATUS CHECKS
  // =========================================================

  isAssigned(
    item: TechnicianAssignment
  ): boolean {

    return item.incident?.status === 'ASSIGNED';

  }


  isInProgress(
    item: TechnicianAssignment
  ): boolean {

    return item.incident?.status === 'IN_PROGRESS';

  }


  isCompleted(
    item: TechnicianAssignment
  ): boolean {

    return item.incident?.status === 'COMPLETED'
      ||
      item.incident?.status === 'RESOLVED';

  }

}