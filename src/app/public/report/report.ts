import { Component } from '@angular/core';

@Component({
  selector: 'app-report',
  imports: [],
  templateUrl: './report.html',
  styleUrl: './report.css',
})
export class Report {

 locationName = '';

latitude!: number;
longitude!: number;

detectLocation() {

  if (!navigator.geolocation) {
    alert('Geolocation not supported');
    return;
  }

  navigator.geolocation.getCurrentPosition(

    async (position) => {

      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;

      try {

        const response = await fetch(

          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${this.latitude}&lon=${this.longitude}`

        );

        const data = await response.json();

        this.locationName =
          data.address.suburb ||
          data.address.neighbourhood ||
          data.address.village ||
          data.address.town ||
          data.display_name;

      } catch (error) {

        console.error(error);

        this.locationName =
          `${this.latitude}, ${this.longitude}`;

      }

    },

    (error) => {

      console.error(error);

    }

  );

}
submitIssue(event: Event) {
  event.preventDefault();

  console.log('Issue Submitted');
}

}
