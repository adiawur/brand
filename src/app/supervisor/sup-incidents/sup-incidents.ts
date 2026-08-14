import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  Incident,
  IncidentService
} from '../../services/incident.service';

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


  // =========================================================
  // MODALS
  // =========================================================

  showDetailsModal = false;

  showAssignModal = false;


  // =========================================================
  // SELECTED DATA
  // =========================================================

  selectedIncident: Incident | null = null;


  // =========================================================
  // INCIDENT DATA
  // =========================================================

  incidents: Incident[] = [];

  filteredIncidents: Incident[] = [];


  // =========================================================
  // TECHNICIANS
  // =========================================================

  technicians: User[] = [];

  availableTechnicians: User[] = [];

  selectedTechnician = '';


  // =========================================================
  // LOADING
  // =========================================================

  loading = false;


  // =========================================================
  // SEARCH & FILTERS
  // =========================================================

  searchTerm = '';

  selectedStatus = '';

  selectedPriority = '';

  selectedType = '';


  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(

    private incidentService: IncidentService,

    private assignmentService: AssignmentService,

    private userService: UserService,

    private alertService: AlertService,

    private cdr: ChangeDetectorRef

  ) {}


  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    this.loadIncidents();

    this.loadTechnicians();

  }


  // =========================================================
  // LOAD INCIDENTS
  // =========================================================

  loadIncidents(): void {

    this.loading = true;

    this.incidentService
      .getAll()
      .subscribe({

        next: (incidents) => {

          this.incidents = incidents || [];

          this.applyFilters();

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


  // =========================================================
  // LOAD TECHNICIANS
  // =========================================================

  loadTechnicians(): void {

    this.userService
      .getTechnicians()
      .subscribe({

        next: (users) => {

          this.technicians = users || [];

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


  // =========================================================
  // APPLY SEARCH & FILTERS
  // =========================================================

  applyFilters(): void {

    const search =
      this.searchTerm
        .trim()
        .toLowerCase();


    this.filteredIncidents =
      this.incidents.filter(
        incident => {


          // -------------------------------------------------
          // SEARCH
          // -------------------------------------------------

          const matchesSearch =
            !search ||

            incident.ticketId
              ?.toLowerCase()
              .includes(search) ||

            incident.reporterName
              ?.toLowerCase()
              .includes(search) ||

            incident.phone
              ?.toLowerCase()
              .includes(search) ||

            incident.location
              ?.toLowerCase()
              .includes(search) ||

            incident.description
              ?.toLowerCase()
              .includes(search);


          // -------------------------------------------------
          // STATUS
          // -------------------------------------------------

          const matchesStatus =
            !this.selectedStatus ||

            incident.status ===
            this.selectedStatus;


          // -------------------------------------------------
          // PRIORITY
          // -------------------------------------------------

          const matchesPriority =
            !this.selectedPriority ||

            incident.priority ===
            this.selectedPriority;


          // -------------------------------------------------
          // TYPE
          // -------------------------------------------------

          const matchesType =
            !this.selectedType ||

            incident.incidentType ===
            this.selectedType;


          return (
            matchesSearch &&
            matchesStatus &&
            matchesPriority &&
            matchesType
          );

        }
      );

  }


  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  clearFilters(): void {

    this.searchTerm = '';

    this.selectedStatus = '';

    this.selectedPriority = '';

    this.selectedType = '';

    this.applyFilters();

  }


  // =========================================================
  // DETAILS
  // =========================================================

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


  // =========================================================
  // MAP
  // =========================================================

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


  // =========================================================
  // OPEN ASSIGN MODAL
  // =========================================================

  openAssignModal(
    incident: Incident
  ): void {

    this.selectedIncident =
      incident;

    this.selectedTechnician =
      '';


    // -------------------------------------------------------
    // ONLY ACTIVE TECHNICIANS
    // -------------------------------------------------------

    this.availableTechnicians =
      this.technicians.filter(
        technician =>
          technician.active === true
      );


    this.showAssignModal = true;

  }


  // =========================================================
  // CLOSE ASSIGN MODAL
  // =========================================================

  closeAssignModal(): void {

    this.showAssignModal = false;

    this.selectedTechnician = '';

    this.selectedIncident = null;

  }


  // =========================================================
  // ASSIGN TECHNICIAN
  // =========================================================

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
        Number(
          this.selectedTechnician
        )

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


  // =========================================================
  // FORMAT INCIDENT TYPE
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

    return priority
      .charAt(0)
      .toUpperCase() +
      priority
        .slice(1)
        .toLowerCase();

  }

}