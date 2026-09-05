import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


// =========================================================
// COMPLAINT STATUS
// =========================================================

export type ComplaintStatus =
  | 'SUBMITTED'
  | 'REVIEWED'
  | 'RESOLVED'
  | 'CLOSED';


// =========================================================
// COMPLAINT REQUEST
// CUSTOMER SUBMIT COMPLAINT / FEEDBACK
// =========================================================

export interface IncidentComplaintRequest {

  ticketId: string;

  fullName: string;

  phone: string;

  email?: string;

  message: string;

}


// =========================================================
// INCIDENT SUMMARY
// =========================================================

export interface ComplaintIncident {

  id: number;

  ticketId: string;

  reporterName: string;

  phone: string;

  email?: string;

  incidentType: string;

  description: string;

  location: string;

  landmark?: string;

  latitude: number;

  longitude: number;

  priority: string;

  status: string;

  reportedAt: string;

  updatedAt?: string;

}


// =========================================================
// INCIDENT COMPLAINT RESPONSE
// =========================================================

export interface IncidentComplaint {

  id: number;

  incident: ComplaintIncident;

  fullName: string;

  phone: string;

  email?: string;

  message: string;

  submittedAt: string;

  status: ComplaintStatus;

}


// =========================================================
// SERVICE
// =========================================================

@Injectable({
  providedIn: 'root'
})
export class IncidentComplaintService {


  // =========================================================
  // BASE URL
  // =========================================================

  private apiUrl =
    'http://localhost:8182/api';


  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
    private http: HttpClient
  ) {}


  // =========================================================
  // CUSTOMER
  // SUBMIT COMPLAINT / FEEDBACK
  // =========================================================

  submitComplaint(
    request: IncidentComplaintRequest
  ): Observable<IncidentComplaint> {

    return this.http.post<IncidentComplaint>(
      `${this.apiUrl}/incidents/complaint`,
      request
    );

  }


  // =========================================================
  // SUPERVISOR
  // GET MY ZONE COMPLAINTS / FEEDBACK
  // =========================================================

  getSupervisorComplaints():
    Observable<IncidentComplaint[]> {

    return this.http.get<IncidentComplaint[]>(
      `${this.apiUrl}/supervisor/complaints`
    );

  }


  // =========================================================
  // TECHNICIAN
  // GET MY ZONE COMPLAINTS / FEEDBACK
  // =========================================================

  getTechnicianComplaints():
    Observable<IncidentComplaint[]> {

    return this.http.get<IncidentComplaint[]>(
      `${this.apiUrl}/technician/complaints`
    );

  }

  

}