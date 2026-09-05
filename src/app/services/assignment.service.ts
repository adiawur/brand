import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AssignmentRequest {

  incidentId: number;

  technicianId: number;

}

export interface Assignment {

  id: number;

  incidentId: number;

  ticketId: string;

  technicianId: number;

  technicianName: string;

  specialization?: string;

  assignedAt: string;

  completedAt?: string;

  status?: string;

}

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {

  private supervisorApiUrl =
    'http://localhost:8182/api/supervisor/assignments';

  private technicianApiUrl =
    'http://localhost:8182/api/technician/assignments';


  constructor(
    private http: HttpClient
  ) {}


  // =========================================================
  // SUPERVISOR
  // =========================================================

  assign(
    data: AssignmentRequest
  ): Observable<Assignment> {

    return this.http.post<Assignment>(
      this.supervisorApiUrl,
      data
    );

  }


  getAll(): Observable<Assignment[]> {

    return this.http.get<Assignment[]>(
      this.supervisorApiUrl
    );

  }


  // =========================================================
  // TECHNICIAN
  // GET MY ASSIGNMENTS
  // =========================================================

  getMyAssignments(): Observable<Assignment[]> {

    return this.http.get<Assignment[]>(
      this.technicianApiUrl
    );

  }


  // =========================================================
  // TECHNICIAN
  // GET ASSIGNMENT BY ID
  // =========================================================

  getMyAssignmentById(
    id: number
  ): Observable<Assignment> {

    return this.http.get<Assignment>(
      `${this.technicianApiUrl}/${id}`
    );

  }


  // =========================================================
  // TECHNICIAN
  // START WORK
  // =========================================================

  startWork(
    id: number
  ): Observable<Assignment> {

    return this.http.patch<Assignment>(
      `${this.technicianApiUrl}/${id}/start`,
      {}
    );

  }


  // =========================================================
  // TECHNICIAN
  // COMPLETE WORK
  // =========================================================

  completeWork(
    id: number,
    notes: string,
    photo?: File
  ): Observable<Assignment> {

    const formData = new FormData();

    const data = {
      notes: notes
    };

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

    return this.http.post<Assignment>(
      `${this.technicianApiUrl}/${id}/complete`,
      formData
    );

    
  }

  
// =========================================================
// SUPERVISOR
// REASSIGN INCIDENT
// =========================================================

reassign(
  assignmentId: number,
  technicianId: number
): Observable<Assignment> {

  return this.http.patch<Assignment>(
    `${this.supervisorApiUrl}/${assignmentId}/reassign`,
    {
      technicianId: technicianId
    }
  );

}


}