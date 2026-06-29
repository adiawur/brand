import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tech-notifications',
  imports: [CommonModule],
  templateUrl: './tech-notifications.html',
  styleUrl: './tech-notifications.css',
})
export class TechNotifications {

  notifications = [

    {
      id: 1,
      title: 'New Assignment',
      message: 'You have been assigned incident INC-004.',
      type: 'assignment',
      time: '10 min ago',
      read: false
    },

    {
      id: 2,
      title: 'Supervisor Comment',
      message: 'Supervisor requested additional photo evidence.',
      type: 'comment',
      time: '30 min ago',
      read: false
    },

    {
      id: 3,
      title: 'SLA Alert',
      message: 'Assignment ASS-002 is approaching SLA deadline.',
      type: 'sla',
      time: '1 hour ago',
      read: false
    },

    {
      id: 4,
      title: 'Task Completed',
      message: 'Your completion report was approved successfully.',
      type: 'success',
      time: 'Yesterday',
      read: true
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
