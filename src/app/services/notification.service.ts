import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private apiUrl = 'http://localhost:8182/api/notifications';

  constructor(
    private http: HttpClient
  ) {}

  getAll() {

    return this.http.get<any[]>(
      this.apiUrl
    );

  }

  markAsRead(id: number) {

    return this.http.patch(
      `${this.apiUrl}/${id}/read`,
      {}
    );

  }

  clearAll() {

    return this.http.delete(
      this.apiUrl
    );

  }

}