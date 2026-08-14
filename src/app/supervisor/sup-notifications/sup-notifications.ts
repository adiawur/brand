import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

interface SupervisorNotification {

  id: number;

  type: string;

  title: string;

  message: string;

  createdAt?: string;

  time?: string;

  read: boolean;

}

@Component({
  selector: 'app-sup-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sup-notifications.html',
  styleUrl: './sup-notifications.css',
})
export class SupNotifications implements OnInit {

  // =========================================================
  // DATA
  // =========================================================

  notifications: SupervisorNotification[] = [];

  // =========================================================
  // STATE
  // =========================================================

  loading = true;

  errorMessage = '';

  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  // =========================================================
  // INIT
  // =========================================================

  ngOnInit(): void {

    this.loadNotifications();

  }

  // =========================================================
  // LOAD NOTIFICATIONS
  // =========================================================

  loadNotifications(): void {

    this.loading = true;

    this.errorMessage = '';

    this.notificationService.getAll()
      .subscribe({

        next: (data) => {

          this.notifications =
            (data || []).map(
              notification =>
                this.normalizeNotification(
                  notification
                )
            );

          this.loading = false;
          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Failed to load notifications:',
            error
          );

          this.errorMessage =
            'Unable to load notifications. Please try again.';

          this.loading = false;

        }

      });

  }

  // =========================================================
  // NORMALIZE RESPONSE
  // =========================================================

  private normalizeNotification(
    notification: any
  ): SupervisorNotification {

    return {

      id: notification.id,

      type:
        notification.type ||
        'GENERAL',

      title:
        notification.title ||
        'Notification',

      message:
        notification.message ||
        '',

      createdAt:
        notification.createdAt,

      time:
        notification.createdAt
          ? this.formatTime(
              notification.createdAt
            )
          : notification.time || '',

      read:
        notification.read === true ||
        notification.isRead === true

    };

  }

  // =========================================================
  // MARK AS READ
  // =========================================================

  markAsRead(
    notification: SupervisorNotification
  ): void {

    if (notification.read) {
      return;
    }

    this.notificationService
      .markAsRead(notification.id)
      .subscribe({

        next: () => {

          notification.read = true;

        },

        error: (error) => {

          console.error(
            'Failed to mark notification as read:',
            error
          );

          alert(
            'Unable to mark notification as read.'
          );

        }

      });

  }

  // =========================================================
  // MARK ALL READ
  // =========================================================

  markAllRead(): void {

    const unread =
      this.notifications.filter(
        notification =>
          !notification.read
      );

    if (unread.length === 0) {

      return;

    }

    let completed = 0;

    let failed = false;

    unread.forEach(notification => {

      this.notificationService
        .markAsRead(notification.id)
        .subscribe({

          next: () => {

            notification.read = true;

            completed++;

            if (
              completed === unread.length &&
              !failed
            ) {

              console.log(
                'All notifications marked as read'
              );

            }

          },

          error: (error) => {

            failed = true;

            console.error(
              'Failed to mark notification:',
              error
            );

            alert(
              'Some notifications could not be marked as read.'
            );

          }

        });

    });

  }

  // =========================================================
  // DELETE / CLEAR ALL
  // =========================================================

  clearAll(): void {

    if (this.notifications.length === 0) {

      return;

    }

    const confirmed =
      window.confirm(
        'Are you sure you want to clear all notifications?'
      );

    if (!confirmed) {

      return;

    }

    this.notificationService
      .clearAll()
      .subscribe({

        next: () => {

          this.notifications = [];

        },

        error: (error) => {

          console.error(
            'Failed to clear notifications:',
            error
          );

          alert(
            'Unable to clear notifications.'
          );

        }

      });

  }

  // =========================================================
  // INDIVIDUAL DELETE
  // =========================================================

  deleteNotification(
    id: number
  ): void {

    /*
     * NotificationService uliyonipa haina
     * DELETE /api/notifications/{id}.
     *
     * Kwa hiyo hatutaunda endpoint ya kubuni.
     *
     * Kwa sasa individual delete inaondoa
     * notification kwenye UI tu.
     *
     * Clear All ndiyo inatumia backend.
     */

    this.notifications =
      this.notifications.filter(
        notification =>
          notification.id !== id
      );

  }

  // =========================================================
  // TIME
  // =========================================================

  formatTime(
    date: string
  ): string {

    const notificationDate =
      new Date(date);

    const now =
      new Date();

    const difference =
      Math.floor(
        (
          now.getTime() -
          notificationDate.getTime()
        ) / 60000
      );

    if (difference < 1) {

      return 'Just now';

    }

    if (difference < 60) {

      return `${difference} minute${
        difference === 1 ? '' : 's'
      } ago`;

    }

    const hours =
      Math.floor(
        difference / 60
      );

    if (hours < 24) {

      return `${hours} hour${
        hours === 1 ? '' : 's'
      } ago`;

    }

    const days =
      Math.floor(
        hours / 24
      );

    if (days < 7) {

      return `${days} day${
        days === 1 ? '' : 's'
      } ago`;

    }

    return notificationDate.toLocaleDateString(
      'en-GB',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );

  }

  // =========================================================
  // TYPE CLASS
  // =========================================================

  getTypeClass(
    type: string
  ): string {

    return type
      .toUpperCase()
      .replace(/_/g, '-');

  }

  // =========================================================
  // RETRY
  // =========================================================

  retry(): void {

    this.loadNotifications();

  }

}