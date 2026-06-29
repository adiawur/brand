import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sup-profile',
  imports: [CommonModule,FormsModule],
  templateUrl: './sup-profile.html',
  styleUrl: './sup-profile.css',
})
export class SupProfile {

  editMode = false;

  supervisor = {
    fullName: 'Amina Hassan',
    username: 'supervisor01',
    email: 'amina@zeco.co.tz',
    phone: '+255712345678',
    role: 'Supervisor',
    zone: 'Urban West',
    image: '/img/sup.jfif'
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
