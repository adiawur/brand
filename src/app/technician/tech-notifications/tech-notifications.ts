import {
  CommonModule
} from '@angular/common';

import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  NotificationService
} from '../../services/notification.service';


@Component({
  selector: 'app-tech-notifications',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './tech-notifications.html',
  styleUrl: './tech-notifications.css',
})
export class TechNotifications implements OnInit {

  // =========================================================
  // DATA
  // =========================================================

  notifications: any[] = [];

  loading = false;


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

    this.notificationService
      .getAll()
      .subscribe({

        next: (data) => {

          this.notifications =
            data || [];

          this.loading = false;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Failed to load notifications:',
            error
          );

          this.loading = false;

          this.cdr.detectChanges();

        }

      });

  }


  // =========================================================
  // MARK AS READ
  // =========================================================

  markAsRead(
    notification: any
  ): void {

    if (
      !notification ||
      notification.read
    ) {

      return;

    }


    this.notificationService
      .markAsRead(
        notification.id
      )
      .subscribe({

        next: () => {

          notification.read = true;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Failed to mark notification as read:',
            error
          );

        }

      });

  }


  // =========================================================
  // MARK ALL READ
  // =========================================================

  markAllRead(): void {

    /*
     * Backend currently does not provide
     * a "mark all as read" endpoint.
     *
     * Therefore we update the current
     * notification list locally.
     */

    this.notifications.forEach(
      notification => {

        notification.read = true;

      }
    );

    this.cdr.detectChanges();

  }


  // =========================================================
  // DELETE NOTIFICATION
  // =========================================================

  deleteNotification(
    id: number
  ): void {

    /*
     * Backend currently supports clearAll()
     * but does not provide delete-by-id.
     *
     * So remove it from the current UI list.
     */

    this.notifications =
      this.notifications.filter(
        notification =>
          notification.id !== id
      );

  }


  // =========================================================
  // GET NOTIFICATION TYPE
  // =========================================================

  getNotificationType(
    notification: any
  ): string {

    return (
      notification?.type ||
      notification?.notificationType ||
      'assignment'
    ).toLowerCase();

  }


  // =========================================================
  // ICON TYPE
  // =========================================================

  isType(
    notification: any,
    type: string
  ): boolean {

    return (
      this.getNotificationType(
        notification
      ) === type
    );

  }

}