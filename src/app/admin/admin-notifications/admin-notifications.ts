import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-notifications',
  imports: [CommonModule],
  templateUrl: './admin-notifications.html',
  styleUrl: './admin-notifications.css',
})
export class AdminNotifications {

  notifications = [

    {
      type:'INCIDENT',
      title:'New Incident Reported',
      message:'A new Power Outage incident was reported in Kisauni.',
      time:'5 minutes ago',
      read:false
    },

    {
      type:'SLA',
      title:'SLA Breached',
      message:'Incident INC-002 exceeded the response time limit.',
      time:'20 minutes ago',
      read:false
    },

    {
      type:'TECHNICIAN',
      title:'Technician Update',
      message:'Technician Salim updated incident INC-003.',
      time:'1 hour ago',
      read:true
    },

    {
      type:'ESCALATION',
      title:'Incident Escalated',
      message:'Supervisor escalated incident INC-005.',
      time:'2 hours ago',
      read:false
    },

    {
      type:'RESOLVED',
      title:'Incident Resolved',
      message:'Incident INC-001 has been successfully resolved.',
      time:'Yesterday',
      read:true
    }

  ];

  markAsRead(notification: any) {

    notification.read = true;

  }

  clearAll() {

    this.notifications = [];

  }

}
