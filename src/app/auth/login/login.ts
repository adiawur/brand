import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';

@Component({
selector: 'app-login',
standalone: true,
imports: [FormsModule, RouterLink, LucideAngularModule],
templateUrl: './login.html',
styleUrl: './login.css'
})
export class Login {

username = '';
password = '';
loading = false;

constructor(
private authService: AuthService,
private router: Router,
private alert: AlertService
) {}

onLogin(event: Event): void {

event.preventDefault();

if (this.loading) {
return;
}

if (!this.username.trim() || !this.password.trim()) {

this.alert.warning(
'Missing Information',
'Please enter your username and password.'
);

return;
}

this.loading = true;

this.authService.login(
this.username.trim(),
this.password
).subscribe({

next: (response) => {

this.loading = false;

this.authService.saveSession(response);

const role = response.role?.toUpperCase();

if (role === 'ADMIN') {

this.alert.success(
'Login Successful',
'Welcome back.'
);

setTimeout(() => {
this.router.navigate(['/admin/dashboard']);
}, 800);

return;
}

if (role === 'SUPERVISOR') {

this.alert.success(
'Login Successful',
'Welcome back.'
);

setTimeout(() => {
this.router.navigate(['/supervisor/dashboard']);
}, 800);

return;
}

if (role === 'TECHNICIAN') {

this.alert.success(
'Login Successful',
'Welcome back.'
);

setTimeout(() => {
this.router.navigate(['/technician/dashboard']);
}, 800);

return;
}

this.authService.logout();

this.alert.error(
'Login Failed',
'Your account role is not recognized.'
);

},

error: (error: HttpErrorResponse) => {

this.loading = false;

this.password = '';

if (error.status === 401) {

this.alert.error(
'Invalid Credentials',
'Invalid username or password.'
);

return;
}

if (error.status === 403) {

this.alert.error(
'Access Denied',
'You are not authorized to access the system.'
);

return;
}

if (error.status >= 500) {

this.alert.error(
'Server Error',
'Something went wrong. Please try again later.'
);

return;
}

if (error.status === 0) {

this.alert.error(
'Connection Error',
'Unable to connect to ZECO Help Desk.'
);

return;
}

this.alert.error(
'Login Failed',
'Unable to sign in. Please try again.'
);

}

});
}

}