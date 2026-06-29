import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-sup-notifications',
  imports: [CommonModule],
  templateUrl: './sup-notifications.html',
  styleUrl: './sup-notifications.css',
})
export class SupNotifications {

  notifications = [

    {
      id: 1,
      type: 'NEW_INCIDENT',
      title: 'New Incident Reported',
      message: 'A new Transformer Fault has been reported in Mwera.',
      time: '5 minutes ago',
      read: false
    },

    {
      id: 2,
      type: 'SLA_ALERT',
      title: 'SLA Warning',
      message: 'Incident INC-004 is approaching SLA deadline.',
      time: '20 minutes ago',
      read: false
    },

    {
      id: 3,
      type: 'TECHNICIAN_UPDATE',
      title: 'Technician Update',
      message: 'Technician Juma marked INC-002 as In Progress.',
      time: '1 hour ago',
      read: true
    },

    {
      id: 4,
      type: 'RESOLVED',
      title: 'Incident Resolved',
      message: 'Incident INC-001 has been resolved successfully.',
      time: 'Today',
      read: true
    },

    {
      id: 5,
      type: 'ESCALATED',
      title: 'Incident Escalated',
      message: 'Incident INC-008 requires urgent attention.',
      time: 'Yesterday',
      read: false
    }

  ];

  markAsRead(notification: any) {
    notification.read = true;
  }

  markAllRead() {
    this.notifications.forEach(n => n.read = true);
  }

  deleteNotification(id: number) {
    this.notifications =
      this.notifications.filter(n => n.id !== id);
  }

}