import {
  ChangeDetectorRef,
  Component
} from '@angular/core';

import {
  Incident,
  IncidentService
} from '../../services/incident.service';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';
import { AlertService } from '../../services/alert.service';
import { IncidentComplaintService } from '../../services/incident-complaint.service';


@Component({
  selector: 'app-track-incident',

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './track-incident.html',

  styleUrl: './track-incident.css',
})
export class TrackIncident {


  // =========================================================
  // TRACKING FORM
  // =========================================================

  fullName = '';

  phone = '';

  email = '';


  // =========================================================
  // INCIDENTS
  // =========================================================

  incidents: Incident[] = [];


  // =========================================================
  // PAGE STATES
  // =========================================================

  loading = false;

  searched = false;

  errorMessage = '';


  // =========================================================
  // DETAILS MODAL
  // =========================================================

  selectedIncident: Incident | null = null;

  showDetailsModal = false;


  // =========================================================
  // COMPLAINT / FEEDBACK MODAL
  // =========================================================

  showComplaintModal = false;

  complaintMessage = '';

  complaintLoading = false;

  complaintError = '';

constructor(

  private incidentService: IncidentService,

  private incidentComplaintService:
    IncidentComplaintService,

  private cdr: ChangeDetectorRef,

  private alertService: AlertService

) {}


  // =========================================================
  // TRACK INCIDENTS
  // =========================================================

  trackIncidents(): void {

    this.errorMessage = '';


    // -------------------------------------------------------
    // VALIDATION
    // -------------------------------------------------------

    if (!this.fullName.trim()) {

      this.errorMessage =
        'Please enter your full name.';

      return;
    }


    if (!this.phone.trim()) {

      this.errorMessage =
        'Please enter your phone number.';

      return;
    }


    // -------------------------------------------------------
    // START SEARCH
    // -------------------------------------------------------

    this.loading = true;

    this.searched = false;

    this.incidents = [];


    const request = {

      fullName: this.fullName.trim(),

      phone: this.phone.trim(),

      email: this.email.trim()
        ? this.email.trim()
        : undefined

    };


    this.incidentService
      .trackIncidents(request)
      .subscribe({

        next: (response) => {

          console.log(
            'Tracked incidents:',
            response
          );


          this.incidents = response;

          this.loading = false;

          this.searched = true;


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'Track incident error:',
            error
          );


          this.loading = false;

          this.searched = true;

          this.incidents = [];


          if (error.status === 400) {

            this.errorMessage =
              'Please check the information you entered.';

          }

          else if (error.status === 404) {

            this.errorMessage =
              'No incidents were found.';

          }

          else {

            this.errorMessage =
              'Unable to connect to the server. Please try again.';

          }


          this.cdr.detectChanges();

        }

      });

  }


  // =========================================================
  // BACK HOME
  // =========================================================

  goBackHome(): void {

    window.history.back();

  }


  // =========================================================
  // CHECK COMPLETED
  // =========================================================

  isCompleted(
    incident: Incident
  ): boolean {

    return (
      incident.status === 'COMPLETED' ||
      incident.status === 'RESOLVED' ||
      incident.status === 'CLOSED'
    );

  }


  // =========================================================
  // CHECK OVERDUE
  // =========================================================

  isOverdue(
    incident: Incident
  ): boolean {

    return (
      !this.isCompleted(incident) &&
      incident.slaStatus?.toUpperCase() === 'OVERDUE'
    );

  }


  // =========================================================
  // GET PROGRESS
  // =========================================================

  getProgress(
    incident: Incident
  ): number {

    switch (incident.status) {

      case 'REPORTED':

        return 15;


      case 'ASSIGNED':

        return 35;


      case 'IN_PROGRESS':

        return 65;


      case 'COMPLETED':

      case 'RESOLVED':

      case 'CLOSED':

        return 100;


      default:

        return 0;

    }

  }


  // =========================================================
  // GET STATUS LABEL
  // =========================================================

  getStatusLabel(
    incident: Incident
  ): string {


    // -------------------------------------------------------
    // COMPLETED
    // -------------------------------------------------------

    if (this.isCompleted(incident)) {

      return 'Completed';

    }


    // -------------------------------------------------------
    // OVERDUE
    // -------------------------------------------------------

    if (this.isOverdue(incident)) {

      return 'Overdue';

    }


    // -------------------------------------------------------
    // IN PROGRESS
    // -------------------------------------------------------

    if (
      incident.status === 'IN_PROGRESS'
    ) {

      return 'In Progress';

    }


    // -------------------------------------------------------
    // ASSIGNED
    // -------------------------------------------------------

    if (
      incident.status === 'ASSIGNED'
    ) {

      return 'Assigned';

    }


    // -------------------------------------------------------
    // REPORTED
    // -------------------------------------------------------

    return 'Reported';

  }


  // =========================================================
  // GET INCIDENT TYPE LABEL
  // =========================================================

  getIncidentTypeLabel(
    type: string
  ): string {

    return type
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(
        /\b\w/g,
        char => char.toUpperCase()
      );

  }


  // =========================================================
  // GET FEEDBACK / COMPLAINT BUTTON LABEL
  // =========================================================

  getFeedbackButtonLabel(
    incident: Incident
  ): string {

    if (this.isCompleted(incident)) {

      return 'Send Feedback';

    }

    return 'Send Complaint';

  }


  // =========================================================
  // OPEN DETAILS MODAL
  // =========================================================

  openDetails(
    incident: Incident
  ): void {

    this.selectedIncident = incident;

    this.showDetailsModal = true;

    document.body.style.overflow = 'hidden';

  }


  // =========================================================
  // CLOSE DETAILS MODAL
  // =========================================================

  closeDetails(): void {

    this.showDetailsModal = false;

    this.selectedIncident = null;

    document.body.style.overflow = '';

  }


  // =========================================================
  // OPEN COMPLAINT / FEEDBACK FROM DETAILS MODAL
  // =========================================================

  openComplaintFromDetails(): void {

    if (!this.selectedIncident) {

      return;

    }


    const incident =
      this.selectedIncident;


    this.showDetailsModal = false;

    this.openComplaint(incident);

  }


  // =========================================================
  // OPEN COMPLAINT / FEEDBACK
  // =========================================================

  openComplaint(
    incident: Incident
  ): void {


    // IMPORTANT:
    // Hakuna tena complaintAllowed check.
    // Kila incident inaruhusiwa kutuma complaint/feedback.

    this.selectedIncident = incident;


    // Clear previous message

    this.complaintMessage = '';

    this.complaintError = '';

    this.complaintLoading = false;


    // Open modal

    this.showComplaintModal = true;


    // Prevent background scrolling

    document.body.style.overflow = 'hidden';


    this.cdr.detectChanges();

  }


  // =========================================================
  // CLOSE COMPLAINT / FEEDBACK
  // =========================================================

  closeComplaint(): void {

    this.showComplaintModal = false;

    this.complaintMessage = '';

    this.complaintError = '';

    this.complaintLoading = false;


    // Restore scrolling

    document.body.style.overflow = '';

  }

  // =========================================================
  // SUBMIT COMPLAINT / FEEDBACK
  // =========================================================

submitComplaint(): void {

  // -------------------------------------------------------
  // CHECK INCIDENT
  // -------------------------------------------------------

  if (!this.selectedIncident) {

    return;

  }


  // -------------------------------------------------------
  // VALIDATE MESSAGE
  // -------------------------------------------------------

  if (!this.complaintMessage.trim()) {

    this.complaintError =
      this.isCompleted(
        this.selectedIncident
      )
        ? 'Please enter your feedback.'
        : 'Please enter your complaint.';

    return;

  }


  // -------------------------------------------------------
  // START SUBMISSION
  // -------------------------------------------------------

  this.complaintError = '';

  this.complaintLoading = true;


  // -------------------------------------------------------
  // SAVE VALUES BEFORE API CALL
  // -------------------------------------------------------

  const isFeedback =
    this.isCompleted(
      this.selectedIncident
    );


  // -------------------------------------------------------
  // REQUEST
  // -------------------------------------------------------

  const request = {

    ticketId:
      this.selectedIncident.ticketId,

    fullName:
      this.fullName.trim(),

    phone:
      this.phone.trim(),

    email:
      this.email.trim()
        ? this.email.trim()
        : undefined,

    message:
      this.complaintMessage.trim()

  };


  console.log(
    'Submitting complaint/feedback:',
    request
  );


  // -------------------------------------------------------
  // API CALL
  // -------------------------------------------------------

  this.incidentComplaintService
    .submitComplaint(request)
    .subscribe({

      // ===================================================
      // SUCCESS
      // ===================================================

      next: (response) => {

        console.log(
          'Complaint/feedback submitted successfully:',
          response
        );


        // -------------------------------------------------
        // STOP LOADING
        // -------------------------------------------------

        this.complaintLoading = false;


        // -------------------------------------------------
        // CLOSE MODAL
        // -------------------------------------------------

        this.showComplaintModal = false;

        this.complaintMessage = '';

        this.complaintError = '';

        document.body.style.overflow = '';


        // -------------------------------------------------
        // FORCE UI UPDATE
        // -------------------------------------------------

        this.cdr.detectChanges();


        // -------------------------------------------------
        // SUCCESS ALERT
        // -------------------------------------------------

        setTimeout(() => {

          if (isFeedback) {

            this.alertService.success(
              'Feedback Submitted',
              'Thank you. Your feedback has been submitted successfully.'
            );

          } else {

            this.alertService.success(
              'Complaint Submitted',
              'Your complaint has been submitted successfully. Our team will review it.'
            );

          }

        }, 100);

      },


      // ===================================================
      // ERROR
      // ===================================================

      error: (error) => {

        console.error(
          'Complaint submission error:',
          error
        );


        // -------------------------------------------------
        // STOP LOADING
        // -------------------------------------------------

        this.complaintLoading = false;


        // -------------------------------------------------
        // ERROR MESSAGE
        // -------------------------------------------------

        const message =
          error?.error?.message ||
          'Unable to submit your complaint. Please try again.';


        this.complaintError =
          message;


        // -------------------------------------------------
        // ERROR ALERT
        // -------------------------------------------------

        this.alertService.error(
          'Submission Failed',
          message
        );


        // -------------------------------------------------
        // UPDATE UI
        // -------------------------------------------------

        this.cdr.detectChanges();

      }

    });

}

}