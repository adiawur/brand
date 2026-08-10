import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  IncidentService
} from '../../services/incident.service';

import {
  AlertService
} from '../../services/alert.service';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './report.html',
  styleUrl: './report.css'
})
export class Report implements OnInit {

  latitude = 0;

  longitude = 0;

  locationDetected = false;

  detectingLocation = true;

  selectedFile?: File;

  showImageUpload = false;

  incident = {

    reporterName: '',

    phone: '',

    email: '',

    incidentType:
      'POWER_OUTAGE',

    description: '',

    landmark: ''

  };

  incidentTypes = [

    {
      value: 'POWER_OUTAGE',
      label: 'Power Outage'
    },

    {
      value: 'TRANSFORMER_FAULT',
      label: 'Transformer Fault'
    },

    {
      value: 'BROKEN_POLE',
      label: 'Broken Pole'
    },

    {
      value: 'EXPOSED_WIRES',
      label: 'Exposed Wires'
    },

    {
      value: 'FIRE_HAZARD',
      label: 'Fire Hazard'
    },

    {
      value: 'VOLTAGE_FLUCTUATION',
      label: 'Voltage Fluctuation'
    },

    {
      value: 'METER_ISSUE',
      label: 'Meter Issue'
    },

    {
      value: 'BILLING_ISSUE',
      label: 'Billing Issue'
    },

    {
      value: 'STREET_LIGHT_FAULT',
      label: 'Street Light Fault'
    },

    {
      value: 'OTHER',
      label: 'Other'
    }

  ];

  constructor(
    private incidentService: IncidentService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {

    this.detectLocation();

    this.onIncidentTypeChange();

  }

  detectLocation(): void {

    this.detectingLocation = true;

    this.locationDetected = false;

    if (!navigator.geolocation) {

      this.detectingLocation = false;

      this.alertService.error(
        'Location Not Supported',
        'Your browser does not support location services.'
      );

      return;
    }

    navigator.geolocation.getCurrentPosition(

      (position) => {

        this.latitude =
          position.coords.latitude;

        this.longitude =
          position.coords.longitude;

        this.locationDetected = true;

        this.detectingLocation = false;

      },

      () => {

        this.detectingLocation = false;

        this.alertService.warning(
          'Location Permission Required',
          'Please allow location access to submit your incident.'
        );

      },

      {
        enableHighAccuracy: true,

        timeout: 10000,

        maximumAge: 0

      }

    );

  }

  onIncidentTypeChange(): void {

    this.showImageUpload = [

      'TRANSFORMER_FAULT',

      'BROKEN_POLE',

      'EXPOSED_WIRES',

      'FIRE_HAZARD'

    ].includes(
      this.incident.incidentType
    );

  }

  onFileSelected(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;

    if (
      !input.files ||
      !input.files.length
    ) {

      return;

    }

    this.selectedFile =
      input.files[0];

  }

  submitIncident(): void {

    if (
      !this.incident.reporterName.trim() ||
      !this.incident.phone.trim() ||
      !this.incident.description.trim()
    ) {

      this.alertService.warning(
        'Missing Information',
        'Please fill in all required fields.'
      );

      return;

    }

    if (!this.locationDetected) {

      this.alertService.warning(
        'Location Required',
        'Please allow location access before submitting the incident.'
      );

      this.detectLocation();

      return;

    }

    if (
      this.showImageUpload &&
      !this.selectedFile
    ) {

      this.alertService.warning(
        'Photo Required',
        'Please attach a photo for this type of incident.'
      );

      return;

    }

    const data = {

      reporterName:
        this.incident.reporterName,

      phone:
        this.incident.phone,

      email:
        this.incident.email,

      incidentType:
        this.incident.incidentType,

      description:
        this.incident.description,

      landmark:
        this.incident.landmark,

      latitude:
        this.latitude,

      longitude:
        this.longitude

    };

    this.incidentService
      .report(
        data,
        this.selectedFile
      )
      .subscribe({

        next: (incident) => {

          this.alertService.success(
            'Incident Submitted',
            `Your incident has been submitted successfully. Ticket ID: ${incident.ticketId}`
          );

          this.resetForm();

        },

        error: (error) => {

          this.alertService.error(
            'Submission Failed',
            error?.error?.message ||
            'Unable to submit your incident.'
          );

        }

      });

  }

  resetForm(): void {

    this.incident = {

      reporterName: '',

      phone: '',

      email: '',

      incidentType:
        'POWER_OUTAGE',

      description: '',

      landmark: ''

    };

    this.selectedFile =
      undefined;

    this.onIncidentTypeChange();

  }

}