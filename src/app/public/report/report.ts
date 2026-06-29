import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report.html',
  styleUrl: './report.css'
})
export class Report implements OnInit {

  location = 'Detecting location...';
  latitude = '';
  longitude = '';

  selectedFile?: File;
  showImageUpload = false;

  incident = {
    reporterName: '',
    phone: '',
    email: '',
    incidentType: 'Power Outage',
    description: '',
    landmark: ''
  };

  incidentTypes = [
    'Power Outage',
    'Transformer Fault',
    'Broken Pole',
    'Exposed Wires',
    'Fire Hazard',
    'Voltage Fluctuation',
    'Meter Issue',
    'Billing Issue',
    'Street Light Fault',
    'Other'
  ];

  ngOnInit(): void {
    this.detectLocation();
    this.onIncidentTypeChange();
  }

  detectLocation() {

    if (!navigator.geolocation) {
      this.location = 'Geolocation not supported';
      return;
    }

    navigator.geolocation.getCurrentPosition(

      (position) => {

        this.latitude =
          position.coords.latitude.toFixed(6);

        this.longitude =
          position.coords.longitude.toFixed(6);

        this.location =
          `${this.latitude}, ${this.longitude}`;
      },

      () => {
        this.location = 'Location access denied';
      }

    );
  }

  onFileSelected(event: any) {

    const file = event.target.files[0];

    if (file) {
      this.selectedFile = file;
    }
  }

  onIncidentTypeChange() {

    const type = this.incident.incidentType;

    this.showImageUpload = [

      'Transformer Fault',
      'Broken Pole',
      'Exposed Wires',
      'Fire Hazard'

    ].includes(type);

  }

  submitIncident() {

    console.log({
      ...this.incident,
      location: this.location,
      latitude: this.latitude,
      longitude: this.longitude,
      attachment: this.selectedFile
    });

    alert('Incident Submitted Successfully');

  }

}