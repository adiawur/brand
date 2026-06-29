import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-sup-dashboard',
  imports: [CommonModule],
  templateUrl: './sup-dashboard.html',
  styleUrl: './sup-dashboard.css',
})
export class SupDashboard {

  recentIncidents = [

    {
      id: 'INC-001',
      customer: 'Ali Hassan',
      type: 'Power Outage',
      priority: 'High',
      status: 'Unassigned'
    },

    {
      id: 'INC-002',
      customer: 'Fatma Omar',
      type: 'Transformer Fault',
      priority: 'High',
      status: 'Assigned'
    },

    {
      id: 'INC-003',
      customer: 'Juma Salim',
      type: 'Meter Issue',
      priority: 'Medium',
      status: 'In Progress'
    }

  ];

}
