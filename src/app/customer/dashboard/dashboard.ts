import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';


@Component({
  selector: 'app-dashboard',
  imports: [CommonModule,LucideAngularModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  customerName = 'Ruwaida Rashid';

  activeView: 'dashboard' | 'tickets' | 'notifications' = 'dashboard';

  pageTitle = 'Dashboard';

  tickets = [
    { id: 'ZECO-001', type: 'Power Outage', status: 'Open' },
    { id: 'ZECO-002', type: 'Meter Fault', status: 'In Progress' },
    { id: 'ZECO-003', type: 'Transformer Fault', status: 'Resolved' }
  ];

  notifications = [
    'Technician assigned to your ticket',
    'Your issue is being investigated',
    'Ticket resolved successfully'
  ];

  get openTickets() {
    return this.tickets.filter(t => t.status === 'Open').length;
  }

  get inProgress() {
    return this.tickets.filter(t => t.status === 'In Progress').length;
  }

  get resolved() {
    return this.tickets.filter(t => t.status === 'Resolved').length;
  }

  setView(view: any) {
    this.activeView = view;

    if (view === 'dashboard') this.pageTitle = 'Dashboard';
    if (view === 'tickets') this.pageTitle = 'My Tickets';
    if (view === 'notifications') this.pageTitle = 'Notifications';
  }

  logout() {
    alert('Logging out...');
  }
}