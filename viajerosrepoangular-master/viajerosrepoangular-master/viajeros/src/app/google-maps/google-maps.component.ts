import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-google-maps',
  standalone: true,
  imports: [],
  templateUrl: './google-maps.component.html',
  styleUrl: './google-maps.component.css'
})
export class GoogleMapsComponent implements OnInit, OnChanges {

  @Input() origin!: { lat: number, lng: number };
  @Input() destination!: { lat: number, lng: number };

  map!: google.maps.Map;
  directionsService!: google.maps.DirectionsService;
  directionsRenderer!: google.maps.DirectionsRenderer;

  ngOnInit(): void {
    this.loadGoogleMaps();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Verifica si las coordenadas de origen o destino han cambiado
    if (changes['origin'] || changes['destination']) {
      // Si el mapa ya está cargado, recalcula la ruta
      if (this.map) {
        this.calculateRoute();
      }
    }
  }

  loadGoogleMaps(): void {
    if (typeof google === 'undefined' || !google.maps) {
      // Espera hasta que la API de Google Maps esté disponible
      const interval = setInterval(() => {
        if (typeof google !== 'undefined' && google.maps) {
          clearInterval(interval); // Para el intervalo cuando se carga la API
          this.initializeMap();
        }
      }, 100);
    } else {
      this.initializeMap();
    }
  }

  initializeMap(): void {
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();

    // Inicializa el mapa en el punto de origen
    const mapOptions = {
      center: this.origin,
      zoom: 10
    };
    this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, mapOptions);
    this.directionsRenderer.setMap(this.map);

    // Calcula la ruta si ya se tienen el origen y destino
    if (this.origin && this.destination) {
      this.calculateRoute();
    }
  }

  calculateRoute(): void {
    const request = {
      origin: new google.maps.LatLng(this.origin.lat, this.origin.lng),
      destination: new google.maps.LatLng(this.destination.lat, this.destination.lng),
      travelMode: google.maps.TravelMode.DRIVING
    };

    this.directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsRenderer.setDirections(result);
      } else {
        console.error('Error al calcular la ruta: ' + status);
      }
    });
  }
}