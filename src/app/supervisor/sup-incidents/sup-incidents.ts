import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sup-incidents',
  
  imports: [CommonModule, FormsModule],
  templateUrl: './sup-incidents.html',
  styleUrl: './sup-incidents.css',
})
export class SupIncidents  { 

  showDetailsModal = false;
  showAssignModal = false;

  selectedIncident: any = null;

  incidents = [

    {
      id:'INC-001',
      customer:'Ali Hassan',
      type:'Power Outage',
      priority:'High',
      status:'Reported',
      location:'Kisauni, Zanzibar',
      latitude:-6.1659,
      longitude:39.2026,
      description:'No electricity in the entire area.',
      requiredSkill:'Power Distribution'
    },

    {
      id:'INC-002',
      customer:'Fatma Omar',
      type:'Transformer Fault',
      priority:'High',
      status:'Reported',
      location:'Mwera, Zanzibar',
      latitude:-6.2123,
      longitude:39.2211,
      description:'Transformer exploded.',
      requiredSkill:'Transformer Maintenance'
    },

    {
      id:'INC-003',
      customer:'Said Ali',
      type:'Meter Issue',
      priority:'Medium',
      status:'Reported',
      location:'Stone Town',
      latitude:-6.1619,
      longitude:39.1880,
      description:'Meter stopped working.',
      requiredSkill:'Meter Installation'
    }

  ];

  technicians = [

    {
      id:1,
      name:'Juma Salim',
      skill:'Power Distribution',
      status:'Available'
    },

    {
      id:2,
      name:'Ali Hassan',
      skill:'Transformer Maintenance',
      status:'Available'
    },

    {
      id:3,
      name:'Hamad Omar',
      skill:'Meter Installation',
      status:'Available'
    },

    {
      id:4,
      name:'Salim Ali',
      skill:'Transformer Maintenance',
      status:'Busy'
    }

  ];

  availableTechnicians: any[] = [];
  selectedTechnician = '';

  openDetails(incident:any){

    this.selectedIncident = incident;
    this.showDetailsModal = true;

  }

  closeDetails(){

    this.showDetailsModal = false;

  }

  openMap(incident:any){

    const lat = incident.latitude;
    const lng = incident.longitude;

    window.open(
      `https://www.google.com/maps?q=${lat},${lng}`,
      '_blank'
    );

  }

  openAssignModal(incident:any){

    this.selectedIncident = incident;

    this.availableTechnicians =
      this.technicians.filter(t =>

        t.status === 'Available' &&
        t.skill === incident.requiredSkill

      );

    this.showAssignModal = true;

  }

  closeAssignModal(){

    this.showAssignModal = false;

  }

  assignTechnician(){

    if(!this.selectedTechnician){
      alert('Please select technician');
      return;
    }

    alert(
      `${this.selectedTechnician}
       assigned successfully`
    );

    this.showAssignModal = false;

  }

}