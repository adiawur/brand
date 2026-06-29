import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tech-dashboard',
  imports: [CommonModule],
  templateUrl: './tech-dashboard.html',
  styleUrl: './tech-dashboard.css',
})
export class TechDashboard {

  assignments = [

    {
      id:'ASS-001',
      customer:'Ali Hassan',
      type:'Power Outage',
      location:'Kisauni',
      status:'Pending',
      date:'Today'
    },

    {
      id:'ASS-002',
      customer:'Fatma Omar',
      type:'Transformer Fault',
      location:'Mwera',
      status:'In Progress',
      date:'Today'
    },

    {
      id:'ASS-003',
      customer:'Juma Salim',
      type:'Meter Issue',
      location:'Stone Town',
      status:'Completed',
      date:'Yesterday'
    }

  ];

}
