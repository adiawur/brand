import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User, UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';


@Component({
selector: 'app-users',
standalone: true,
imports: [CommonModule, FormsModule],
templateUrl: './users.html',
styleUrl: './users.css'
})
export class Users implements OnInit {

showAddModal = false;
showViewModal = false;
showEditModal = false;

selectedUser: User | null = null;

users: User[] = [];

searchTerm = '';
selectedRole = 'All Roles';

loading = false;

newUser = {
fullName: '',
username: '',
email: '',
phone: '',
password: '',
role: 'TECHNICIAN',
specialization: '',
zone: '',
imageUrl: ''
};


zones = [
  {
    value: 'URBAN_WEST',
    label: 'Urban West'
  },
  {
    value: 'UNGUJA_NORTH',
    label: 'Unguja North'
  },
  {
    value: 'UNGUJA_SOUTH',
    label: 'Unguja South'
  },
  {
    value: 'PEMBA_NORTH',
    label: 'Pemba North'
  },
  {
    value: 'PEMBA_SOUTH',
    label: 'Pemba South'
  },
  {
    value: 'ZANZIBAR',
    label: 'Zanzibar'
  }
];

incidentTypes = [
  {
    value: 'POWER_OUTAGE',
    label: 'Power Outage'
  },
  {
    value: 'TRANSFORMER_FAULT',
    label: 'Transformer Fault'
  },
  {
    value: 'BROKEN_POLE',
    label: 'Broken Pole'
  },
  {
    value: 'EXPOSED_WIRES',
    label: 'Exposed Wires'
  },
  {
    value: 'FIRE_HAZARD',
    label: 'Fire Hazard'
  },
  {
    value: 'VOLTAGE_FLUCTUATION',
    label: 'Voltage Fluctuation'
  },
  {
    value: 'METER_ISSUE',
    label: 'Meter Issue'
  },
  {
    value: 'BILLING_ISSUE',
    label: 'Billing Issue'
  },
  {
    value: 'STREET_LIGHT_FAULT',
    label: 'Street Light Fault'
  },
  {
    value: 'OTHER',
    label: 'Other'
  }
];

constructor(
private userService: UserService,
private alertService: AlertService,
private cdr: ChangeDetectorRef
) {}

ngOnInit(): void {
this.loadUsers();
}

loadUsers(): void {

this.loading = true;

this.userService.getAll().subscribe({

next: (users) => {

this.users = users;

this.cdr.detectChanges();

this.loading = false;

},

error: (error) => {

this.loading = false;

this.showError(
error,
'Unable to load users.'
);

}

});

}

get filteredUsers(): User[] {

return this.users.filter(user => {

const search = this.searchTerm
.toLowerCase()
.trim();

const matchesSearch =
!search ||
user.fullName.toLowerCase().includes(search) ||
user.username.toLowerCase().includes(search) ||
user.email.toLowerCase().includes(search) ||
user.phone.toLowerCase().includes(search);

const matchesRole =
this.selectedRole === 'All Roles' ||
user.role === this.selectedRole;

return matchesSearch && matchesRole;

});

}

// ADD USER
openAddModal(): void {

this.showViewModal = false;
this.showEditModal = false;

this.newUser = {
fullName: '',
username: '',
email: '',
phone: '',
password: '',
role: 'TECHNICIAN',
specialization: '',
zone: '',
imageUrl: ''
};

this.showAddModal = true;

}

// CLOSE ADD
closeAddModal(): void {

this.showAddModal = false;

}

// VIEW USER
openViewModal(user: User): void {

this.showAddModal = false;
this.showEditModal = false;

this.selectedUser = user;

this.showViewModal = true;

}

// CLOSE VIEW
closeViewModal(): void {

this.showViewModal = false;

this.selectedUser = null;

}

// EDIT USER
openEditModal(user: User): void {

this.showAddModal = false;
this.showViewModal = false;

this.selectedUser = {
...user
};

this.showEditModal = true;

}

// CLOSE EDIT
closeEditModal(): void {

this.showEditModal = false;

this.selectedUser = null;

}

// =========================================================
// CREATE USER
// =========================================================

saveUser(): void {

  // -------------------------------------------------------
  // BASIC REQUIRED FIELDS
  // -------------------------------------------------------

  if (
    !this.newUser.fullName.trim() ||
    !this.newUser.username.trim() ||
    !this.newUser.email.trim() ||
    !this.newUser.phone.trim() ||
    !this.newUser.password.trim()
  ) {

    this.alertService.warning(
      'Missing Information',
      'Please fill in all required fields.'
    );

    return;
  }


  // -------------------------------------------------------
  // SUPERVISOR / TECHNICIAN MUST HAVE ZONE
  // -------------------------------------------------------

  if (
    (
      this.newUser.role === 'SUPERVISOR' ||
      this.newUser.role === 'TECHNICIAN'
    ) &&
    !this.newUser.zone.trim()
  ) {

    this.alertService.warning(
      'Zone Required',
      'Please select a zone for this user.'
    );

    return;
  }


  // -------------------------------------------------------
  // TECHNICIAN MUST HAVE SPECIALIZATION
  // -------------------------------------------------------

  if (
    this.newUser.role === 'TECHNICIAN' &&
    !this.newUser.specialization.trim()
  ) {

    this.alertService.warning(
      'Specialization Required',
      'Please select the technician specialization.'
    );

    return;
  }


  // -------------------------------------------------------
  // START LOADING
  // -------------------------------------------------------

  this.loading = true;


  // -------------------------------------------------------
  // CREATE USER
  // -------------------------------------------------------

  this.userService
    .create(this.newUser)
    .subscribe({

      // ===================================================
      // SUCCESS
      // ===================================================

      next: (user) => {

        this.users.unshift(user);

        this.loading = false;

        this.closeAddModal();

        this.cdr.detectChanges();

        this.alertService.success(
          'User Created',
          `${user.fullName} has been created successfully.`
        );

      },


      // ===================================================
      // ERROR
      // ===================================================

      error: (error) => {

        this.loading = false;

        this.showError(
          error,
          'Unable to create user.'
        );

      }

    });

}
// =========================================================
// UPDATE USER
// =========================================================

updateUser(): void {

  // -------------------------------------------------------
  // CHECK SELECTED USER
  // -------------------------------------------------------

  if (!this.selectedUser) {

    return;
  }


  // -------------------------------------------------------
  // BASIC REQUIRED FIELDS
  // -------------------------------------------------------

  if (
    !this.selectedUser.fullName.trim() ||
    !this.selectedUser.username.trim() ||
    !this.selectedUser.email.trim() ||
    !this.selectedUser.phone.trim()
  ) {

    this.alertService.warning(
      'Missing Information',
      'Please fill in all required fields.'
    );

    return;
  }


  // -------------------------------------------------------
  // SUPERVISOR / TECHNICIAN MUST HAVE ZONE
  // -------------------------------------------------------

  if (
    (
      this.selectedUser.role === 'SUPERVISOR' ||
      this.selectedUser.role === 'TECHNICIAN'
    ) &&
    !this.selectedUser.zone?.trim()
  ) {

    this.alertService.warning(
      'Zone Required',
      'Please select a zone for this user.'
    );

    return;
  }


  // -------------------------------------------------------
  // TECHNICIAN MUST HAVE SPECIALIZATION
  // -------------------------------------------------------

  if (
    this.selectedUser.role === 'TECHNICIAN' &&
    !this.selectedUser.specialization?.trim()
  ) {

    this.alertService.warning(
      'Specialization Required',
      'Please select the technician specialization.'
    );

    return;
  }


  // -------------------------------------------------------
  // REQUEST DATA
  // -------------------------------------------------------

  const data = {

    fullName:
      this.selectedUser.fullName.trim(),

    username:
      this.selectedUser.username.trim(),

    email:
      this.selectedUser.email.trim(),

    phone:
      this.selectedUser.phone.trim(),

    role:
      this.selectedUser.role,

    specialization:
      this.selectedUser.role === 'TECHNICIAN'
        ? this.selectedUser.specialization
        : '',

    zone:
      (
        this.selectedUser.role === 'SUPERVISOR' ||
        this.selectedUser.role === 'TECHNICIAN'
      )
        ? this.selectedUser.zone
        : '',

    imageUrl:
      this.selectedUser.imageUrl

  };


  // -------------------------------------------------------
  // START LOADING
  // -------------------------------------------------------

  this.loading = true;


  // -------------------------------------------------------
  // UPDATE API
  // -------------------------------------------------------

  this.userService
    .update(
      this.selectedUser.id,
      data
    )
    .subscribe({

      // ===================================================
      // SUCCESS
      // ===================================================

      next: (updatedUser) => {

        this.updateUserInList(
          updatedUser
        );

        const fullName =
          updatedUser.fullName;

        this.loading = false;

        this.closeEditModal();

        this.cdr.detectChanges();

        this.alertService.success(
          'User Updated',
          `${fullName} has been updated successfully.`
        );

      },


      // ===================================================
      // ERROR
      // ===================================================

      error: (error) => {

        this.loading = false;

        this.showError(
          error,
          'Unable to update user.'
        );

      }

    });

}

// UPDATE LOCAL USER
private updateUserInList(user: User): void {

const index =
this.users.findIndex(
item => item.id === user.id
);

if (index !== -1) {

this.users[index] = user;

}

}

// CHANGE STATUS
changeStatus(user: User): void {

const action =
user.active
? 'deactivate'
: 'activate';

const title =
action === 'activate'
? 'Activate User?'
: 'Deactivate User?';

this.alertService
.confirm(
title,
`Are you sure you want to ${action} ${user.fullName}?`,
action === 'activate'
? 'Activate'
: 'Deactivate'
)
.then(confirmed => {

if (!confirmed) {

return;

}

this.userService
.changeStatus(user.id)
.subscribe({

next: (updatedUser) => {

const index =
this.users.findIndex(
item => item.id === updatedUser.id
);

if (index !== -1) {

this.users[index] =
updatedUser;

}

this.cdr.detectChanges();

this.alertService.success(
'Status Updated',
`${updatedUser.fullName} is now ${updatedUser.active ? 'Active' : 'Inactive'}.`
);

},

error: (error) => {

this.showError(
error,
'Unable to change user status.'
);

}

});

});

}

// DELETE USER
deleteUser(user: User): void {

this.alertService
.confirm(
'Delete User?',
`Are you sure you want to delete ${user.fullName}?`,
'Delete'
)
.then(confirmed => {

if (!confirmed) {

return;

}

this.userService
.delete(user.id)
.subscribe({

next: () => {

this.users =
this.users.filter(
item => item.id !== user.id
);

this.cdr.detectChanges();

this.alertService.success(
'User Deleted',
'User has been deleted successfully.'
);

},

error: (error) => {

this.showError(
error,
'Unable to delete user.'
);

}

});

});

}

// HANDLE API ERRORS
private showError(
error: any,
fallback: string
): void {

let message = fallback;

if (error?.error?.message) {

message = error.error.message;

} else if (
typeof error?.error === 'string'
) {

message = error.error;

} else if (error?.message) {

message = error.message;

}

this.alertService.error(
'Operation Failed',
message
);

}


}