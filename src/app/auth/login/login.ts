import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-login',
  imports: [LucideAngularModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
   constructor(private router: Router) {}

  onLogin(event: Event) {
    event.preventDefault();

    // demo login logic
    const role = "customer";

    if (role === "customer") {
      this.router.navigate(['/customer/dashboard']);
    }
  }
}
