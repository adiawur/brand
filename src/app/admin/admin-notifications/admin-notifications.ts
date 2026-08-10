import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  NotificationService
} from '../../services/notification.service';

import {
  AlertService
} from '../../services/alert.service';

@Component({
  selector: 'app-admin-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-notifications.html',
  styleUrl: './admin-notifications.css'
})
export class AdminNotifications implements OnInit {

  notifications: any[] = [];

  loading = false;

  constructor(
    private notificationService: NotificationService,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.loadNotifications();

  }

  loadNotifications(): void {

    this.loading = true;

    this.notificationService
      .getAll()
      .subscribe({

        next: (notifications) => {

          this.notifications = notifications;

          this.loading = false;

          this.cdr.detectChanges();

        },

        error: (error) => {

          this.loading = false;

          this.showError(
            error,
            'Unable to load notifications.'
          );

        }

      });

  }

  markAsRead(
    notification: any
  ): void {

    this.notificationService
      .markAsRead(notification.id)
      .subscribe({

        next: () => {

          notification.read = true;

          this.cdr.detectChanges();

        },

        error: (error) => {

          this.showError(
            error,
            'Unable to mark notification as read.'
          );

        }

      });

  }

  clearAll(): void {

    if (!this.notifications.length) {

      this.alertService.info(
        'No Notifications',
        'There are no notifications to clear.'
      );

      return;

    }

    this.notificationService
      .clearAll()
      .subscribe({

        next: () => {

          this.notifications = [];

          this.cdr.detectChanges();

          this.alertService.success(
            'Notifications Cleared',
            'All notifications have been cleared.'
          );

        },

        error: (error) => {

          this.showError(
            error,
            'Unable to clear notifications.'
          );

        }

      });

  }

  formatTime(
    date: string
  ): string {

    const value =
      new Date(date);

    return value.toLocaleString(
      'en-GB',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    );

  }

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

    }

    this.alertService.error(
      'Operation Failed',
      message
    );

  }

}