import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  Chart,
  registerables
} from 'chart.js';

import {
  ReportService
} from '../../services/report.service';

import {
  AlertService
} from '../../services/alert.service';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-reports.html',
  styleUrl: './admin-reports.css'
})
export class AdminReports implements OnInit {

  dashboard: any = null;

  typeData: any[] = [];

  priorityData: any[] = [];

  slaData: any[] = [];

  statusData: any[] = [];

  loading = false;

  typeChart?: Chart;
  priorityChart?: Chart;
  slaChart?: Chart;
  statusChart?: Chart;

  constructor(
    private reportService: ReportService,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.loadReports();

  }

  loadReports(): void {

    this.loading = true;

    this.reportService.getDashboard()
      .subscribe({

        next: (data) => {

          this.dashboard = data;

          this.loading = false;

          this.cdr.detectChanges();

        },

        error: (error) => {

          this.loading = false;

          this.showError(
            error,
            'Unable to load report summary.'
          );

        }

      });

    this.reportService.getTypes()
      .subscribe({

        next: (data) => {

          this.typeData = data;

          this.createTypeChart();

        },

        error: () => {}

      });

    this.reportService.getPriority()
      .subscribe({

        next: (data) => {

          this.priorityData = data;

          this.createPriorityChart();

        },

        error: () => {}

      });

    this.reportService.getSla()
      .subscribe({

        next: (data) => {

          this.slaData = data;

          this.createSlaChart();

        },

        error: () => {}

      });

    this.reportService.getStatus()
      .subscribe({

        next: (data) => {

          this.statusData = data;

          this.createStatusChart();

        },

        error: () => {}

      });

  }

  createTypeChart(): void {

    if (this.typeChart) {
      this.typeChart.destroy();
    }

    const canvas =
      document.getElementById(
        'typeChart'
      ) as HTMLCanvasElement;

    if (!canvas) {
      return;
    }

    this.typeChart = new Chart(
      canvas,
      {
        type: 'bar',

        data: {

          labels: this.typeData.map(
            item => this.format(
              item.incidentType
            )
          ),

          datasets: [{

            label: 'Incidents',

            data: this.typeData.map(
              item => item.count
            )

          }]

        },

        options: {

          responsive: true,

          maintainAspectRatio: false,

          plugins: {

            legend: {
              display: false
            }

          },

          scales: {

            y: {
              beginAtZero: true
            }

          }

        }

      }
    );

  }

  createPriorityChart(): void {

    if (this.priorityChart) {
      this.priorityChart.destroy();
    }

    const canvas =
      document.getElementById(
        'priorityReportChart'
      ) as HTMLCanvasElement;

    if (!canvas) {
      return;
    }

    this.priorityChart = new Chart(
      canvas,
      {
        type: 'doughnut',

        data: {

          labels: this.priorityData.map(
            item => this.format(
              item.priority
            )
          ),

          datasets: [{

            data: this.priorityData.map(
              item => item.count
            )

          }]

        },

        options: {

          responsive: true,

          maintainAspectRatio: false,

          plugins: {

            legend: {
              position: 'bottom'
            }

          }

        }

      }
    );

  }

  createSlaChart(): void {

    if (this.slaChart) {
      this.slaChart.destroy();
    }

    const canvas =
      document.getElementById(
        'slaReportChart'
      ) as HTMLCanvasElement;

    if (!canvas) {
      return;
    }

    this.slaChart = new Chart(
      canvas,
      {
        type: 'bar',

        data: {

          labels: this.slaData.map(
            item => this.format(
              item.slaStatus
            )
          ),

          datasets: [{

            label: 'Incidents',

            data: this.slaData.map(
              item => item.count
            )

          }]

        },

        options: {

          responsive: true,

          maintainAspectRatio: false,

          plugins: {

            legend: {
              display: false
            }

          },

          scales: {

            y: {
              beginAtZero: true
            }

          }

        }

      }
    );

  }

  createStatusChart(): void {

    if (this.statusChart) {
      this.statusChart.destroy();
    }

    const canvas =
      document.getElementById(
        'statusReportChart'
      ) as HTMLCanvasElement;

    if (!canvas) {
      return;
    }

    this.statusChart = new Chart(
      canvas,
      {
        type: 'doughnut',

        data: {

          labels: this.statusData.map(
            item => this.format(
              item.status
            )
          ),

          datasets: [{

            data: this.statusData.map(
              item => item.count
            )

          }]

        },

        options: {

          responsive: true,

          maintainAspectRatio: false,

          plugins: {

            legend: {
              position: 'bottom'
            }

          }

        }

      }
    );

  }

  format(value: string): string {

    return value
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, char =>
        char.toUpperCase()
      );

  }

  downloadPDF(): void {

    this.alertService.info(
      'PDF Report',
      'PDF export will be connected to the report generator.'
    );

  }

  downloadExcel(): void {

    this.alertService.info(
      'Excel Report',
      'Excel export will be connected to the report generator.'
    );

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

    }

    this.alertService.error(
      'Operation Failed',
      message
    );

  }

}