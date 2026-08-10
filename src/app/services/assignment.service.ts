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

}

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {

  private apiUrl =
    'http://localhost:8182/api/supervisor/assignments';

  constructor(
    private http: HttpClient
  ) {}

  assign(
    data: AssignmentRequest
  ): Observable<Assignment> {

    return this.http.post<Assignment>(
      this.apiUrl,
      data
    );

  }

  getAll(): Observable<Assignment[]> {

    return this.http.get<Assignment[]>(
      this.apiUrl
    );

  }

}