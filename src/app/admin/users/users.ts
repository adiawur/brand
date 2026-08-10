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

// CREATE USER
saveUser(): void {

if (
!this.newUser.fullName.trim() ||
!this.newUser.username.trim() ||
!this.newUser.email.trim() ||
!this.newUser.phone.trim() ||
!this.newUser.password.trim() ||
!this.newUser.specialization.trim() ||
!this.newUser.zone.trim()
) {

this.alertService.warning(
'Missing Information',
'Please fill in all required fields.'
);

return;

}

this.loading = true;

this.userService.create(this.newUser).subscribe({

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

error: (error) => {

this.loading = false;

this.showError(
error,
'Unable to create user.'
);

}

});

}

// UPDATE USER
updateUser(): void {

if (!this.selectedUser) {

return;

}

if (
!this.selectedUser.fullName.trim() ||
!this.selectedUser.username.trim() ||
!this.selectedUser.email.trim() ||
!this.selectedUser.phone.trim() ||
!this.selectedUser.specialization?.trim() ||
!this.selectedUser.zone?.trim()
) {

this.alertService.warning(
'Missing Information',
'Please fill in all required fields.'
);

return;

}

const data = {

fullName: this.selectedUser.fullName,

username: this.selectedUser.username,

email: this.selectedUser.email,

phone: this.selectedUser.phone,

role: this.selectedUser.role,

specialization: this.selectedUser.specialization,

zone: this.selectedUser.zone,

imageUrl: this.selectedUser.imageUrl

};

this.loading = true;

this.userService
.update(
this.selectedUser.id,
data
)
.subscribe({

next: (updatedUser) => {

this.updateUserInList(updatedUser);

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