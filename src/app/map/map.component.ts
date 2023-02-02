import { Component, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent {
  apiLoaded: Observable<boolean>;

  title = 'angular-google-maps-app';

  @ViewChild('ShipGoogleMap', { static: false })
  map!: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false })
  info!: MapInfoWindow;

  center: google.maps.LatLngLiteral = {lat: 0, lng: -100};
  zoom = 3;
  maxZoom = 15;
  minZoom = 2;
  options: google.maps.MapOptions = {
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    maxZoom:this.maxZoom,
    minZoom:this.minZoom,
  }
  markers = [
    { position: { 
        lat: -40, 
        lng: -80, 
      },
      label: { 
        text: 'Embarcación A',
        className: 'marker-label',
       },
      title: 'Embarcación A',
      info: 'Embarcación A',
      icon: {
        url: 'http://localhost:4200/assets/ship.png',
      }
    },
    { position: { 
        lat: -20, 
        lng: -90, 
      },
      label: { 
        text: 'Embarcación B',
        className: 'marker-label',
      },
      title: 'Embarcación B',
      info: 'Embarcación B',
      icon: {
        url: 'http://localhost:4200/assets/ship.png',
      }
    },
  ] as any;
  markerInfoContent = {
    title: '',
    info: ''
  }

  constructor(httpClient: HttpClient) {
    this.apiLoaded = httpClient.jsonp('https://maps.googleapis.com/maps/api/js?key=AIzaSyAgtL5AtnkCqIu3hs9jQ9z1XWXd2gBdmmI', 'callback')
        .pipe(
          map(() => true),
          catchError(() => of(false)),
        );
  }

  ngOnInit() {
    console.log('Init');
  }

  zoomIn() {
    if (this.zoom < this.maxZoom) this.zoom++;
    console.log('Get Zoom',this.map.getZoom());
  }

  zoomOut() {
    if (this.zoom > this.minZoom) this.zoom--;
  }

  eventHandler(event: any ,name:string){
    console.log(event, name);
  }

  addMarker(event:any) {
    this.markers.push({
      position: {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      },
      label: {
        color: 'blue',
        text: 'Embarcación ' + (this.markers.length + 1),
      },
      title: 'Marker title ' + (this.markers.length + 1),
      info: 'Marker info ' + (this.markers.length + 1),
      options: {
        animation: google.maps.Animation.DROP,
      },
    })
  }

  openInfo(marker: MapMarker, title: string, info: string) {
    this.markerInfoContent.title = title;
    this.markerInfoContent.info = info;
    this.info.open(marker)
  }

}
