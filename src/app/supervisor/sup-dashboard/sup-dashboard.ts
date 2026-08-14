import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Incident, IncidentService } from '../../services/incident.service';

@Component({
  selector: 'app-sup-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sup-dashboard.html',
  styleUrl: './sup-dashboard.css',
})
export class SupDashboard implements OnInit {

  // =========================================================
  // LOADING / ERROR
  // =========================================================
   today = new Date();
  loading = true;
  errorMessage = '';

  // =========================================================
  // STATS
  // =========================================================

  totalIncidents = 0;
  unassigned = 0;
  inProgress = 0;
  resolvedToday = 0;

  // =========================================================
  // DATA
  // =========================================================

  incidents: Incident[] = [];

  recentIncidents: Incident[] = [];

  slaAlerts: Incident[] = [];

  // =========================================================
  // TREND
  // =========================================================

  trendData: {
    label: string;
    count: number;
  }[] = [];

  maxTrendCount = 1;

  constructor(
    private incidentService: IncidentService,
    private cdr: ChangeDetectorRef
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
    this.errorMessage = '';

    this.incidentService.getAll().subscribe({

      next: (data) => {

        this.incidents = data || [];

        this.calculateStats();

        this.prepareRecentIncidents();

        this.prepareSlaAlerts();

        this.prepareTrend();

        this.loading = false;

        this.cdr.detectChanges();

      },

      error: (error) => {

        console.error(
          'Failed to load supervisor dashboard:',
          error
        );

        this.errorMessage =
          'Unable to load dashboard data. Please try again.';

        this.loading = false;

      }

    });

  }

  // =========================================================
  // CALCULATE STATS
  // =========================================================

  calculateStats(): void {

    this.totalIncidents =
      this.incidents.length;


    // -------------------------------------------------------
    // UNASSIGNED
    // -------------------------------------------------------

    this.unassigned =
      this.incidents.filter(
        incident =>
          incident.status === 'REPORTED'
      ).length;


    // -------------------------------------------------------
    // IN PROGRESS
    // -------------------------------------------------------

    this.inProgress =
      this.incidents.filter(
        incident =>
          incident.status === 'IN_PROGRESS'
      ).length;


    // -------------------------------------------------------
    // RESOLVED TODAY
    // -------------------------------------------------------

    const today =
      new Date();

    this.resolvedToday =
      this.incidents.filter(
        incident => {

          if (
            incident.status !== 'RESOLVED' &&
            incident.status !== 'CLOSED'
          ) {
            return false;
          }

          const date =
            new Date(
              incident.updatedAt ||
              incident.reportedAt
            );

          return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
          );

        }
      ).length;

  }

  // =========================================================
  // RECENT INCIDENTS
  // =========================================================

  prepareRecentIncidents(): void {

    this.recentIncidents =
      [...this.incidents]

        .sort(
          (a, b) =>
            new Date(b.reportedAt).getTime() -
            new Date(a.reportedAt).getTime()
        )

        .slice(0, 5);

  }

  // =========================================================
  // SLA ALERTS
  // =========================================================

  prepareSlaAlerts(): void {

    this.slaAlerts =
      this.incidents

        .filter(
          incident =>
            incident.slaStatus === 'BREACHED' ||
            incident.slaStatus === 'AT_RISK'
        )

        .sort(
          (a, b) =>
            new Date(b.reportedAt).getTime() -
            new Date(a.reportedAt).getTime()
        )

        .slice(0, 4);

  }

  // =========================================================
  // INCIDENT TREND
  // LAST 7 DAYS
  // =========================================================

  prepareTrend(): void {

    const today =
      new Date();

    this.trendData = [];

    for (
      let i = 6;
      i >= 0;
      i--
    ) {

      const date =
        new Date(today);

      date.setDate(
        today.getDate() - i
      );

      const count =
        this.incidents.filter(
          incident => {

            const reported =
              new Date(
                incident.reportedAt
              );

            return (
              reported.getDate() === date.getDate() &&
              reported.getMonth() === date.getMonth() &&
              reported.getFullYear() === date.getFullYear()
            );

          }
        ).length;

      this.trendData.push({

        label:
          date.toLocaleDateString(
            'en-US',
            {
              weekday: 'short'
            }
          ),

        count

      });

    }

    this.maxTrendCount =
      Math.max(
        ...this.trendData.map(
          item => item.count
        ),
        1
      );

  }

  // =========================================================
  // HELPERS
  // =========================================================

  getPriorityClass(
    priority: string
  ): string {

    return priority.toLowerCase();

  }

  getStatusClass(
    status: string
  ): string {

    return status
      .toLowerCase()
      .replace('_', '-');

  }

  formatType(
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

  formatDate(
    date: string
  ): string {

    return new Date(date)
      .toLocaleDateString(
        'en-GB',
        {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }
      );

  }

  retry(): void {

    this.loadDashboard();

  }

}