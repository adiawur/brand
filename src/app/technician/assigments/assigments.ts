import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-assigments',
  imports: [CommonModule,FormsModule],
  templateUrl: './assigments.html',
  styleUrl: './assigments.css',
})
export class Assigments {

  showDetailsModal = false;
  showUpdateModal = false;

  selectedAssignment: any = null;
  selectedFile?: File;

  updateData = {
    status: '',
    notes: ''
  };

  assignments = [

    {
      id:'ASS-001',
      customer:'Ali Hassan',
      type:'Power Outage',
      priority:'High',
      status:'Assigned',
      location:'Kisauni, Zanzibar',
      latitude:-6.1659,
      longitude:39.2026,
      description:'Entire area has no electricity.'
    },

    {
      id:'ASS-002',
      customer:'Fatma Omar',
      type:'Transformer Fault',
      priority:'High',
      status:'In Progress',
      location:'Mwera, Zanzibar',
      latitude:-6.2123,
      longitude:39.2211,
      description:'Transformer exploded.'
    },

    {
      id:'ASS-003',
      customer:'Juma Salim',
      type:'Meter Issue',
      priority:'Medium',
      status:'Assigned',
      location:'Stone Town',
      latitude:-6.1619,
      longitude:39.1880,
      description:'Meter not functioning.'
    }

  ];

  openDetails(item: any) {
    this.selectedAssignment = item;
    this.showDetailsModal = true;
  }

  closeDetails() {
    this.showDetailsModal = false;
  }

  openUpdate(item: any) {
    this.selectedAssignment = item;
    this.updateData = {
      status: item.status,
      notes: ''
    };
    this.showUpdateModal = true;
  }

  closeUpdate() {
    this.showUpdateModal = false;
  }

  openMap(item: any) {

    window.open(
      `https://www.google.com/maps?q=${item.latitude},${item.longitude}`,
      '_blank'
    );

  }

  onFileSelected(event: any) {

    if(event.target.files.length > 0){
      this.selectedFile = event.target.files[0];
    }

  }

  submitUpdate() {

    if(
      this.updateData.status === 'Completed'
      &&
      (!this.updateData.notes || !this.selectedFile)
    ){
      alert(
        'Please provide notes and photo evidence before completing.'
      );
      return;
    }

    alert('Assignment updated successfully.');

    this.showUpdateModal = false;
  }

}
