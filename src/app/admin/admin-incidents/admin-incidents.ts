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
  Incident,
  IncidentService
} from '../../services/incident.service';

import {
  AlertService
} from '../../services/alert.service';

@Component({
  selector: 'app-admin-incidents',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './admin-incidents.html',
  styleUrl: './admin-incidents.css'
})
export class AdminIncidents implements OnInit {

  incidents: Incident[] = [];

  selectedIncident: Incident | null = null;

  showDetailsModal = false;

  loading = false;

  searchTerm = '';

  selectedStatus = 'All Status';

  selectedPriority = 'All Priorities';


  constructor(
    private incidentService: IncidentService,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    this.loadIncidents();

  }


  loadIncidents(): void {

    this.loading = true;

    this.incidentService
      .getAll()
      .subscribe({

        next: (incidents) => {

          this.incidents = incidents;

          this.loading = false;

          this.cdr.detectChanges();

        },

        error: (error) => {

          this.loading = false;

          this.showError(
            error,
            'Unable to load incidents.'
          );

        }

      });

  }


  get filteredIncidents(): Incident[] {

    const search =
      this.searchTerm
        .toLowerCase()
        .trim();

    return this.incidents.filter(
      incident => {

        const matchesSearch =
          !search ||
          incident.ticketId
            .toLowerCase()
            .includes(search) ||
          incident.reporterName
            .toLowerCase()
            .includes(search) ||
          incident.phone
            .toLowerCase()
            .includes(search) ||
          incident.location
            .toLowerCase()
            .includes(search);

        const matchesStatus =
          this.selectedStatus === 'All Status' ||
          incident.status === this.selectedStatus;

        const matchesPriority =
          this.selectedPriority === 'All Priorities' ||
          incident.priority === this.selectedPriority;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesPriority
        );

      }
    );

  }


  openDetails(
    incident: Incident
  ): void {

    this.selectedIncident = incident;

    this.showDetailsModal = true;

  }


  closeDetails(): void {

    this.showDetailsModal = false;

    this.selectedIncident = null;

  }


  formatIncidentType(
    type: string
  ): string {

    return type
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, char =>
        char.toUpperCase()
      );

  }


  formatStatus(
    status: string
  ): string {

    return status
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, char =>
        char.toUpperCase()
      );

  }


  formatPriority(
    priority: string
  ): string {

    return priority
      .charAt(0)
      .toUpperCase() +
      priority.slice(1).toLowerCase();

  }


  formatSla(
    sla: string
  ): string {

    switch (sla) {

      case 'ON_TIME':
        return 'On Time';

      case 'AT_RISK':
        return 'At Risk';

      case 'BREACHED':
        return 'Breached';

      case 'COMPLETED':
        return 'Completed';

      default:
        return 'N/A';

    }

  }


  formatDate(
    date?: string
  ): string {

    if (!date) {

      return 'N/A';

    }

    const value = new Date(date);

    if (isNaN(value.getTime())) {

      return 'N/A';

    }

    return value.toLocaleString(
      'en-GB',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }
    );

  }


  formatRemaining(
    minutes?: number
  ): string {

    if (
      minutes === null ||
      minutes === undefined
    ) {

      return 'N/A';

    }

    if (minutes < 0) {

      return `${Math.abs(minutes)} min overdue`;

    }

    if (minutes < 60) {

      return `${minutes} min remaining`;

    }

    const hours =
      Math.floor(minutes / 60);

    const remaining =
      minutes % 60;

    if (!remaining) {

      return `${hours}h remaining`;

    }

    return `${hours}h ${remaining}m remaining`;

  }


  getAttachmentUrl(
    attachment?: string
  ): string {

    if (!attachment) {

      return '';

    }

    if (
      attachment.startsWith('http://') ||
      attachment.startsWith('https://')
    ) {

      return attachment;

    }

    return `http://localhost:8182/uploads/incidents/${attachment}`;

  }


  private showError(
    error: any,
    fallback: string
  ): void {

    let message = fallback;

    if (error?.error?.message) {

      message = error.error.message;

    } else if (
      typeof error?.error === 'string'
    ) {

      message = error.error;

    } else if (error?.message) {

      message = error.message;

    }

    this.alertService.error(
      'Operation Failed',
      message
    );

  }

}