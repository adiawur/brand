import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tech-profile',
  imports: [CommonModule,FormsModule],
  templateUrl: './tech-profile.html',
  styleUrl: './tech-profile.css',
})
export class TechProfile {

  editMode = false;

  technician = {
    fullName: 'Juma Salim',
    username: 'tech01',
    email: 'juma@zeco.co.tz',
    phone: '+255712345678',
    role: 'Technician',
    specialization: 'Transformer Maintenance',
    zone: 'Urban West',
    status: 'Available',
    image: '/img/tech.jfif'
  };

  toggleEdit() {
    this.editMode = !this.editMode;
  }

  saveProfile() {

    this.editMode = false;

    alert('Profile updated successfully');

  }

  updatePassword() {

    alert('Password updated successfully');

  }

}
