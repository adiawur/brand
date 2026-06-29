import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-incidents',
  imports: [CommonModule],
  templateUrl: './admin-incidents.html',
  styleUrl: './admin-incidents.css',
})
export class AdminIncidents {

  showDetailsModal = false;
  selectedIncident: any = null;

  incidents = [

    {
      id:'INC-001',
      customer:'Ali Hassan',
      type:'Power Outage',
      priority:'High',
      status:'Assigned',
      supervisor:'Amina Omar',
      technician:'Juma Said',
      sla:'On Time',
      location:'Kisauni, Zanzibar',
      description:'No electricity in the area.',
      supervisorAction:'Assigned technician.',
      technicianAction:'Travelling to site.'
    },

    {
      id:'INC-002',
      customer:'Fatma Ali',
      type:'Transformer Fault',
      priority:'High',
      status:'In Progress',
      supervisor:'Hassan Ali',
      technician:'Salim Juma',
      sla:'Breached',
      location:'Mwera, Zanzibar',
      description:'Transformer exploded.',
      supervisorAction:'Marked as urgent.',
      technicianAction:'Repair in progress.'
    },

    {
      id:'INC-003',
      customer:'Said Omar',
      type:'Meter Issue',
      priority:'Low',
      status:'Resolved',
      supervisor:'Amina Omar',
      technician:'Ali Juma',
      sla:'On Time',
      location:'Stone Town',
      description:'Meter not working.',
      supervisorAction:'Assigned technician.',
      technicianAction:'Meter replaced.'
    }

  ];

  openDetails(incident: any) {

    this.selectedIncident = incident;
    this.showDetailsModal = true;

  }

  closeDetails() {

    this.showDetailsModal = false;

  }

}
