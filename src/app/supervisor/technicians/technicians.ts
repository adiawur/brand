import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-technicians',
  imports: [CommonModule,FormsModule],
  templateUrl: './technicians.html',
  styleUrl: './technicians.css',
})
export class Technicians {

  showAddModal = false;
  showViewModal = false;
  showEditModal = false;

  selectedTechnician: any = null;

  technicians = [

    {
      name: 'Ali Hassan',
      email: 'ali@zeco.co.tz',
      phone: '+255712345678',
      zone: 'Urban West',
      status: 'Available',
      image: 'assets/img/user.jpg'
    },

    {
      name: 'Juma Salim',
      email: 'juma@zeco.co.tz',
      phone: '+255712345679',
      zone: 'North A',
      status: 'Busy',
      image: 'assets/img/user.jpg'
    },

    {
      name: 'Fatma Omar',
      email: 'fatma@zeco.co.tz',
      phone: '+255712345680',
      zone: 'Urban',
      status: 'Offline',
      image: 'assets/img/user.jpg'
    }

  ];

  newTechnician = {
    name: '',
    email: '',
    phone: '',
    zone: ''
  };

  openAddModal() {
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  saveTechnician() {
    this.closeAddModal();
  }

  openViewModal(technician: any) {
    this.selectedTechnician = technician;
    this.showViewModal = true;
  }

  closeViewModal() {
    this.showViewModal = false;
  }

  openEditModal(technician: any) {
    this.selectedTechnician = {...technician};
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
  }

  updateTechnician() {
    this.closeEditModal();
  }

}