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
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {

  dashboard: any = null;

  statusData: any[] = [];

  priorityData: any[] = [];

  slaData: any[] = [];

  loading = false;

  statusChart?: Chart;
  priorityChart?: Chart;
  slaChart?: Chart;

  constructor(
    private reportService: ReportService,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.loadDashboard();

  }

  loadDashboard(): void {

    this.loading = true;

    this.reportService.getDashboard()
      .subscribe({

        next: (data) => {

          this.dashboard = data;

          this.loadCharts();

          this.loading = false;

          this.cdr.detectChanges();

        },

        error: (error) => {

          this.loading = false;

          this.showError(
            error,
            'Unable to load dashboard.'
          );

        }

      });

  }

  loadCharts(): void {

    this.reportService.getStatus()
      .subscribe({

        next: (data) => {

          this.statusData = data;

          this.createStatusChart();

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

  }

  createStatusChart(): void {

    if (this.statusChart) {
      this.statusChart.destroy();
    }

    const canvas =
      document.getElementById(
        'statusChart'
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
            item => this.format(item.status)
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

  createPriorityChart(): void {

    if (this.priorityChart) {
      this.priorityChart.destroy();
    }

    const canvas =
      document.getElementById(
        'priorityChart'
      ) as HTMLCanvasElement;

    if (!canvas) {
      return;
    }

    this.priorityChart = new Chart(
      canvas,
      {
        type: 'bar',

        data: {

          labels: this.priorityData.map(
            item => this.format(item.priority)
          ),

          datasets: [{

            label: 'Incidents',

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

  createSlaChart(): void {

    if (this.slaChart) {
      this.slaChart.destroy();
    }

    const canvas =
      document.getElementById(
        'slaChart'
      ) as HTMLCanvasElement;

    if (!canvas) {
      return;
    }

    this.slaChart = new Chart(
      canvas,
      {
        type: 'doughnut',

        data: {

          labels: this.slaData.map(
            item => this.format(item.slaStatus)
          ),

          datasets: [{

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