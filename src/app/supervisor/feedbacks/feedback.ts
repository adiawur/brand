import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IncidentComplaintService,
  IncidentComplaint
} from '../../services/incident-complaint.service';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './feedback.html',
  styleUrls: ['./feedback.css']
})
export class Feedback implements OnInit {

  complaints: IncidentComplaint[] = [];

  loading = false;

  errorMessage = '';

  successMessage = '';

  // ---------------------------------------------
  // MODAL
  // ---------------------------------------------

  showModal = false;

  selectedComplaint: IncidentComplaint | null = null;

  replyMessage = '';

  replying = false;


  constructor(
    private complaintService:
      IncidentComplaintService,
      
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    this.loadComplaints();

  }


  // =============================================
  // LOAD
  // =============================================

  loadComplaints(): void {

    this.loading = true;

    this.errorMessage = '';

    this.complaintService
      .getSupervisorComplaints()
      .subscribe({

        next: (data) => {

          this.complaints = data;

          this.loading = false;
          
          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(error);

          this.errorMessage =
            error?.error?.message ||
            'Failed to load complaints and feedback.';

          this.loading = false;

        }

      });

  }


  // =============================================
  // OPEN
  // =============================================

  openComplaint(
    complaint: IncidentComplaint
  ): void {

    this.selectedComplaint = complaint;

    this.replyMessage = '';

    this.showModal = true;

  }


  // =============================================
  // CLOSE
  // =============================================

  closeComplaint(): void {

    this.showModal = false;

    this.selectedComplaint = null;

    this.replyMessage = '';

  }


  // =============================================
  // REPLY
  // =============================================

  reply(): void {

    if (
      !this.selectedComplaint ||
      !this.replyMessage.trim()
    ) {

      return;

    }

    /*
     * Backend reply endpoint bado haipo.
     *
     * Hapa tuta-connect endpoint
     * baada ya kuiongeza backend.
     */

    this.replying = true;

    this.errorMessage = '';

    // temporary placeholder
    console.log(
      'Reply:',
      this.selectedComplaint.id,
      this.replyMessage
    );

    /*
     * HAPA TUTAWEKA:

     this.complaintService.replyComplaint(
       this.selectedComplaint.id,
       this.replyMessage
     ).subscribe(...)

    */

    this.replying = false;

  }


  // =============================================
  // STATUS CLASS
  // =============================================

  getStatusClass(
    status: string
  ): string {

    switch (
      status?.toUpperCase()
    ) {

      case 'SUBMITTED':
        return 'status-submitted';

      case 'REVIEWED':
        return 'status-reviewed';

      case 'RESOLVED':
        return 'status-resolved';

      case 'CLOSED':
        return 'status-closed';

      default:
        return 'status-default';

    }

  }


  // =============================================
  // STATUS FORMAT
  // =============================================

  formatStatus(
    status: string
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
  // TRACK
  // =============================================

  trackById(
    index: number,
    item: IncidentComplaint
  ): number {

    return item.id;

  }

}