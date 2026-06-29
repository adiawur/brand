import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users {
  showAddModal = false;
showViewModal = false;
showEditModal = false;

selectedUser: any = null;

newUser = {
  name: '',
  username: '',
  email: '',
  phone: '',
  role: 'Technician',
  status: 'Active'
};

  users = [

    {
      name:'Amina Hassan',
      username:'amina',
      email:'amina@zeco.co.tz',
      phone:'+255712345678',
      role:'Supervisor',
      status:'Active',
      image:'assets/img/user.jpg'
    },

    {
      name:'Ali Omar',
      username:'ali',
      email:'ali@zeco.co.tz',
      phone:'+255712000111',
      role:'Technician',
      status:'Active',
      image:'assets/img/user.jpg'
    },

    {
      name:'Juma Salim',
      username:'juma',
      email:'juma@zeco.co.tz',
      phone:'+255712111222',
      role:'Customer',
      status:'Inactive',
      image:'assets/img/user.jpg'
    },

    {
      name:'Fatma Said',
      username:'fatma',
      email:'fatma@zeco.co.tz',
      phone:'+255712555666',
      role:'Admin',
      status:'Active',
      image:'assets/img/user.jpg'
    }

  ];

  openAddModal() {
  this.showAddModal = true;
}

closeAddModal() {
  this.showAddModal = false;
}

openViewModal(user: any) {
  this.selectedUser = user;
  this.showViewModal = true;
}

closeViewModal() {
  this.showViewModal = false;
}

openEditModal(user: any) {
  this.selectedUser = { ...user };
  this.showEditModal = true;
}

closeEditModal() {
  this.showEditModal = false;
}

saveUser() {
  console.log(this.newUser);
  this.closeAddModal();
}

updateUser() {
  console.log(this.selectedUser);
  this.closeEditModal();
}

}