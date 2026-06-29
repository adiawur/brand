import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-profile.html',
  styleUrl: './admin-profile.css',
})
export class AdminProfile {

  editMode = false;

  admin = {
    fullName: 'System Administrator',
    username: 'admin',
    email: 'admin@zeco.co.tz',
    phone: '+255712345678',
    role: 'Administrator',
    department: 'ICT Department',
    image: 'img/admin.png'
  };

  toggleEdit() {
    this.editMode = !this.editMode;
  }

  saveProfile() {
    this.editMode = false;
    alert('Profile updated successfully');
  }

}
