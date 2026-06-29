import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import {
  Chart,
  registerables
} from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-reports',
  imports: [CommonModule],
  templateUrl: './admin-reports.html',
  styleUrl: './admin-reports.css',
})
export class AdminReports implements AfterViewInit {

  @ViewChild('trendChart')
  trendChart!: ElementRef;

  @ViewChild('statusChart')
  statusChart!: ElementRef;

  @ViewChild('categoryChart')
  categoryChart!: ElementRef;

  ngAfterViewInit(): void {

    this.loadTrendChart();
    this.loadStatusChart();
    this.loadCategoryChart();

  }

  loadTrendChart() {

    new Chart(this.trendChart.nativeElement, {

      type: 'line',

      data: {

        labels: [
          'Jan','Feb','Mar',
          'Apr','May','Jun'
        ],

        datasets: [{

          label: 'Incidents',

          data: [45,60,55,80,90,120],

          borderColor: '#6D071A',

          backgroundColor: 'rgba(109,7,26,.1)',

          tension: .4,

          fill: true

        }]

      },

      options: {

        responsive: true,
        maintainAspectRatio: false

      }

    });

  }

  loadStatusChart() {

    new Chart(this.statusChart.nativeElement, {

      type: 'doughnut',

      data: {

        labels: [
          'Resolved',
          'Pending',
          'In Progress'
        ],

        datasets: [{

          data: [65,20,15],

          backgroundColor: [
            '#198754',
            '#ffc107',
            '#0d6efd'
          ]

        }]

      },

      options: {

        responsive: true,
        maintainAspectRatio: false

      }

    });

  }

  loadCategoryChart() {

    new Chart(this.categoryChart.nativeElement, {

      type: 'bar',

      data: {

        labels: [

          'Outage',
          'Meter',
          'Transformer',
          'Voltage',
          'Other'

        ],

        datasets: [{

          label: 'Cases',

          data: [120,70,45,30,15],

          backgroundColor: '#6D071A'

        }]

      },

      options: {

        responsive: true,
        maintainAspectRatio: false

      }

    });

  }

  downloadPDF() {

    alert('PDF report downloaded');

  }

  downloadExcel() {

    alert('Excel report downloaded');

  }

}