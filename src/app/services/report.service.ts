import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private apiUrl = 'http://localhost:8182/api/admin/reports';

  constructor(private http: HttpClient) {}

  getDashboard() {
    return this.http.get<any>(
      `${this.apiUrl}/dashboard`
    );
  }

  getStatus() {
    return this.http.get<any[]>(
      `${this.apiUrl}/status`
    );
  }

  getPriority() {
    return this.http.get<any[]>(
      `${this.apiUrl}/priority`
    );
  }

  getTypes() {
    return this.http.get<any[]>(
      `${this.apiUrl}/types`
    );
  }

  getSla() {
    return this.http.get<any[]>(
      `${this.apiUrl}/sla`
    );
  }
}