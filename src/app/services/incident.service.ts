import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type IncidentStatus =
  | 'REPORTED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'RESOLVED'
  | 'CLOSED';

export type IncidentType =
  | 'POWER_OUTAGE'
  | 'TRANSFORMER_FAULT'
  | 'BROKEN_POLE'
  | 'EXPOSED_WIRES'
  | 'FIRE_HAZARD'
  | 'VOLTAGE_FLUCTUATION'
  | 'METER_ISSUE'
  | 'BILLING_ISSUE'
  | 'STREET_LIGHT_FAULT'
  | 'OTHER';

export type Priority =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH';

export interface TrackIncidentRequest {

  fullName: string;

  phone: string;

  email?: string;
}
export interface Incident {

  id: number;
  ticketId: string;
  reporterName: string;
  phone: string;
  email?: string;

  incidentType: IncidentType;
  description: string;
  location: string;
  landmark?: string;

  latitude: number;
  longitude: number;

  attachment?: string;

  priority: Priority;
  status: IncidentStatus;

  reportedAt: string;
  updatedAt?: string;

  slaDeadline?: string;
  slaStatus: string;

  elapsedMinutes: number;
  remainingMinutes?: number;

  resolutionNotes?: string;

  slaAlertSent: boolean;

  // Complaint / Feedback
  complaintAllowed?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class IncidentService {

  private apiUrl =
    'http://localhost:8182/api/incidents';

  constructor(
    private http: HttpClient
  ) {}

  getAll(): Observable<Incident[]> {

    return this.http.get<Incident[]>(
      this.apiUrl
    );

  }

  getById(id: number): Observable<Incident> {

    return this.http.get<Incident>(
      `${this.apiUrl}/${id}`
    );

  }

  getByTicketId(
    ticketId: string
  ): Observable<Incident> {

    return this.http.get<Incident>(
      `${this.apiUrl}/ticket/${ticketId}`
    );

  }

  report(
    data: any,
    photo?: File
  ): Observable<Incident> {

    const formData = new FormData();

    formData.append(
      'data',
      JSON.stringify(data)
    );

    if (photo) {

      formData.append(
        'photo',
        photo
      );

    }

    return this.http.post<Incident>(
      `${this.apiUrl}/report`,
      formData
    );

  }

  // ==========================================
  // TRACK INCIDENTS
  // ==========================================

  trackIncidents(
    request: TrackIncidentRequest
  ): Observable<Incident[]> {

    return this.http.post<Incident[]>(
      `${this.apiUrl}/track`,
      request
    );

  }

  submitComplaint(request: {

  ticketId: string;

  fullName: string;

  phone: string;

  email?: string;

  message: string;

}): Observable<any> {

  return this.http.post<any>(
    `${this.apiUrl}/complaint`,
    request
  );
}

}