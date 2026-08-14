import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import {
  Assignment,
  AssignmentService
} from '../../services/assignment.service';

import {
  Incident,
  IncidentService
} from '../../services/incident.service';

@Component({
  selector: 'app-tech-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './tech-dashboard.html',
  styleUrl: './tech-dashboard.css',
})
export class TechDashboard implements OnInit {

  // =========================================================
  // LOADING
  // =========================================================

  loading = false;

  // =========================================================
  // STATS
  // =========================================================

  totalAssignments = 0;

  pendingTasks = 0;

  inProgressTasks = 0;

  completedTasks = 0;

  // =========================================================
  // ASSIGNMENTS
  // =========================================================

  assignments: any[] = [];

  // =========================================================
  // TODAY'S TASKS
  // =========================================================

  todayTasks: any[] = [];

  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
    private assignmentService: AssignmentService,
    private incidentService: IncidentService,
    private router: Router,
    private cdr:ChangeDetectorRef
  ) {}

  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    this.loadDashboard();

  }

  // =========================================================
  // LOAD DASHBOARD
  // =========================================================

  loadDashboard(): void {

    this.loading = true;

    this.assignmentService
      .getMyAssignments()
      .subscribe({

        next: (assignments) => {

          this.loadIncidents(assignments);
          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Failed to load technician assignments:',
            error
          );

          this.loading = false;

        }

      });

  }

  // =========================================================
  // LOAD INCIDENTS
  // =========================================================

  loadIncidents(
    assignments: Assignment[]
  ): void {

    this.incidentService
      .getAll()
      .subscribe({

        next: (incidents) => {

          this.buildDashboard(
            assignments,
            incidents
          );

          this.loading = false;
          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Failed to load incidents:',
            error
          );

          this.loading = false;

        }

      });

  }

  // =========================================================
  // BUILD DASHBOARD
  // =========================================================

  buildDashboard(
    assignments: Assignment[],
    incidents: Incident[]
  ): void {

    this.assignments =
      assignments.map(
        assignment => {

          const incident =
            incidents.find(
              item =>
                item.id ===
                assignment.incidentId
            );

          return {

            id:
              assignment.ticketId,

            assignmentId:
              assignment.id,

            incidentId:
              assignment.incidentId,

            customer:
              incident?.reporterName ||
              'Unknown Customer',

            phone:
              incident?.phone || '',

            type:
              this.formatType(
                incident?.incidentType || ''
              ),

            priority:
              incident?.priority || '',

            status:
              incident?.status || '',

            location:
              incident?.location || 'Unknown',

            latitude:
              incident?.latitude,

            longitude:
              incident?.longitude,

            description:
              incident?.description || '',

            date:
              this.formatDate(
                assignment.assignedAt
              ),

            assignedAt:
              assignment.assignedAt,

            completedAt:
              assignment.completedAt

          };

        }
      );

    // =======================================================
    // STATS
    // =======================================================

    this.totalAssignments =
      this.assignments.length;

    this.pendingTasks =
      this.assignments.filter(
        item =>
          item.status === 'ASSIGNED'
      ).length;

    this.inProgressTasks =
      this.assignments.filter(
        item =>
          item.status === 'IN_PROGRESS'
      ).length;

    this.completedTasks =
      this.assignments.filter(
        item =>
          item.status === 'COMPLETED' ||
          item.status === 'RESOLVED'
      ).length;

    // =======================================================
    // TODAY'S TASKS
    // =======================================================

    const today =
      new Date();

    this.todayTasks =
      this.assignments.filter(
        item =>
          this.isToday(
            item.assignedAt
          )
      );

  }

  // =========================================================
  // FORMAT TYPE
  // =========================================================

  formatType(
    type: string
  ): string {

    if (!type) {

      return 'Incident';

    }

    return type
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(
        /\b\w/g,
        char =>
          char.toUpperCase()
      );

  }

  // =========================================================
  // FORMAT STATUS
  // =========================================================

  formatStatus(
    status: string
  ): string {

    return status
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(
        /\b\w/g,
        char =>
          char.toUpperCase()
      );

  }

  // =========================================================
  // FORMAT DATE
  // =========================================================

  formatDate(
    date: string
  ): string {

    if (!date) {

      return '-';

    }

    const value =
      new Date(date);

    if (
      isNaN(
        value.getTime()
      )
    ) {

      return '-';

    }

    return value.toLocaleDateString(
      'en-GB',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );

  }

  // =========================================================
  // CHECK TODAY
  // =========================================================

  isToday(
    date: string
  ): boolean {

    if (!date) {

      return false;

    }

    const value =
      new Date(date);

    const today =
      new Date();

    return (
      value.getDate() ===
        today.getDate()
      &&
      value.getMonth() ===
        today.getMonth()
      &&
      value.getFullYear() ===
        today.getFullYear()
    );

  }

  // =========================================================
  // STATUS DISPLAY
  // =========================================================

  getStatusLabel(
    status: string
  ): string {

    return this.formatStatus(
      status
    );

  }

  // =========================================================
  // QUICK ACTIONS
  // =========================================================

  viewAssignments(): void {

    this.router.navigate([
      '/technician/assignments'
    ]);

  }

  // =========================================================
  // OPEN MAP
  // =========================================================

  openMap(): void {

    const assignment =
      this.assignments.find(
        item =>
          item.latitude &&
          item.longitude
      );

    if (!assignment) {

      return;

    }

    window.open(
      `https://www.google.com/maps?q=${assignment.latitude},${assignment.longitude}`,
      '_blank'
    );

  }

  // =========================================================
  // OPEN FIRST PENDING TASK
  // =========================================================

  submitReport(): void {

    const task =
      this.assignments.find(
        item =>
          item.status ===
          'IN_PROGRESS'
      )
      ||
      this.assignments.find(
        item =>
          item.status ===
          'ASSIGNED'
      );

    if (!task) {

      return;

    }

    this.router.navigate([
      '/technician/assignments'
    ]);

  }

}