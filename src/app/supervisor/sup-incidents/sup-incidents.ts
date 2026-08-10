import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {Incident,IncidentService} from '../../services/incident.service';

import {
  AssignmentService
} from '../../services/assignment.service';

import {
  User,
  UserService
} from '../../services/user.service';

import {
  AlertService
} from '../../services/alert.service';

@Component({
  selector: 'app-sup-incidents',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './sup-incidents.html',
  styleUrl: './sup-incidents.css'
})
export class SupIncidents implements OnInit {

  showDetailsModal = false;

  showAssignModal = false;

  selectedIncident: Incident | null = null;

  incidents: Incident[] = [];

  technicians: User[] = [];

  availableTechnicians: User[] = [];

  selectedTechnician = '';

  loading = false;

  constructor(
    private incidentService: IncidentService,private assignmentService: AssignmentService,private userService: UserService,private alertService: AlertService,private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.loadIncidents();

    this.loadTechnicians();

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

        error: () => {

          this.loading = false;

          this.alertService.error(
            'Operation Failed',
            'Unable to load incidents.'
          );

        }

      });

  }

  loadTechnicians(): void {

  this.userService
    .getTechnicians()
    .subscribe({

      next: (users) => {

        this.technicians = users;
        this.cdr.detectChanges();

      },

      error: () => {

        this.alertService.error(
          'Operation Failed',
          'Unable to load technicians.'
        );

      }

    });

}

  openDetails(
    incident: Incident
  ): void {

    this.selectedIncident =
      incident;

    this.showDetailsModal = true;

  }

  closeDetails(): void {

    this.showDetailsModal = false;

    this.selectedIncident = null;

  }

  openMap(
    incident: Incident
  ): void {

    const lat =
      incident.latitude;

    const lng =
      incident.longitude;

    window.open(
      `https://www.google.com/maps?q=${lat},${lng}`,
      '_blank'
    );

  }

  openAssignModal(
    incident: Incident
  ): void {

    this.selectedIncident =
      incident;

    this.selectedTechnician =
      '';

    this.availableTechnicians =
      this.technicians;

    this.showAssignModal = true;

  }

  closeAssignModal(): void {

    this.showAssignModal = false;

    this.selectedTechnician = '';

  }

  assignTechnician(): void {

    if (
      !this.selectedIncident ||
      !this.selectedTechnician
    ) {

      this.alertService.warning(
        'Select Technician',
        'Please select a technician first.'
      );

      return;

    }

    const data = {

      incidentId:
        this.selectedIncident.id,

      technicianId:
        Number(this.selectedTechnician)

    };

    this.assignmentService
      .assign(data)
      .subscribe({

        next: () => {

          this.alertService.success(
            'Assignment Successful',
            'Technician assigned successfully.'
          );

          this.closeAssignModal();

          this.loadIncidents();

        },

        error: (error) => {

          this.alertService.error(
            'Assignment Failed',
            error?.error?.message ||
            'Unable to assign technician.'
          );

        }

      });

  }

  formatType(
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
      priority
        .slice(1)
        .toLowerCase();

  }

}