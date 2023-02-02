import { Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Ship } from '../ship';
import { ShipService } from "../ship.service";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {
  apiLoaded: Observable<boolean>;

  @ViewChild('ShipGoogleMap', { static: false })
  map!: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false })
  info!: MapInfoWindow;

  title = 'angular-google-maps-app';
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

  markers = [] as any;
  markerInfoContent = {
    title: '',
    description: '',
    info: '',
    lat: 0,
    lng: 0,
    latDest: 0,
    lngDest: 0,
    direction: '',
  }

  public showFrm:boolean = false;
  formTitle = 'Agregar Embarcación';
  formBtn = 'Agregar';
  formType = 'add';

  ships!: Ship[];
  ship: Ship = new Ship();

  frmName: any;
  frmDescription: any;
  frmDirection: any;
  frmLngIni: number | undefined;
  frmLatIni: number | undefined;
  frmLatDest: number | undefined;
  frmLngDest: number | undefined;
  frmId: number | undefined;

  constructor(httpClient: HttpClient, private shipService: ShipService ) {
    this.apiLoaded = httpClient.jsonp('https://maps.googleapis.com/maps/api/js?key=AIzaSyAgtL5AtnkCqIu3hs9jQ9z1XWXd2gBdmmI', 'callback')
        .pipe(
          map(() => true),
          catchError(() => of(false)),
        );
  }

  ngOnInit() {
    console.log('Init');
    this.getShips();
  }

  //////////////////////////////
  // Map Methods
  //////////////////////////////

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

  openInfo(marker: MapMarker, title: string, description: string, latDest: number, lngDest: number, direction: string) {
    this.markerInfoContent.title = title;
    this.markerInfoContent.description = description;
    this.markerInfoContent.lat = latDest;
    this.markerInfoContent.lng = lngDest;
    this.markerInfoContent.direction = direction;

    this.info.open(marker)
  }

  //////////////////////////////
  // Actions
  //////////////////////////////

  // Show/Hide Form
  toggleForm() {
    this.showFrm = !this.showFrm;
  }

  // New Ship Button
  btnAddShipForm() {
    this.formTitle = 'Agregar Embarcación';
    this.formBtn = 'Agregar';
    this.formType = 'add';
    
    this.frmId = undefined;
    this.frmName = '';
    this.frmDescription = '';
    this.frmLatDest = undefined;
    this.frmLngDest = undefined;
    this.frmLatIni = undefined;
    this.frmLngIni = undefined;
    this.frmDirection = '';

    this.showFrm = true;
  }

  // Submit button
  frmSubmit(formValues: any, event: any) {
    event.preventDefault();

    // Add Ship
    if (this.formType == 'add') {
      this.shipService.addShip(formValues).subscribe(response => {
        console.log('Add response', response);
        this.markers = [];
        this.getShips();
        this.showFrm = false;
        alert('Embarcación agregada correctamente');
      });
    }

    // Edit Ship
    if (this.formType == 'edit') {
      console.log('Form Edit Ship');
      console.log(formValues);

      this.shipService.updateShip(formValues).subscribe(response => {
        console.log('Update response', response);
        this.markers = [];
        this.getShips();
        this.showFrm = false;
        alert('Embarcación actualizada correctamente');
      });
    }
  }

  // Edit Ships button
  btnEditForm(id: number) {
    console.log('Edit', id);
    this.shipService.getShip(id).subscribe(response => {
      console.log('Edit response', response);
      this.ship = response;
      this.formTitle = 'Editar Embarcación';
      this.formBtn = 'Editar';
      this.formType = 'edit';

      this.frmId = this.ship.id;
      this.frmName = this.ship.name;
      this.frmDescription = this.ship.description;
      this.frmLatDest = this.ship.latDest;
      this.frmLngDest = this.ship.lngDest;
      this.frmLatIni = this.ship.latIni;
      this.frmLngIni = this.ship.lngIni;
      this.frmDirection = this.ship.direction;

      this.showFrm = true;
    });
  }

  // Delete Ship button
  btnDeleteShip(id: number) {
    let response = confirm(`¿Seguro que deseas eliminar la embarcación con id ${id}?`);
    if (response) {
      this.shipService.deleteShip(id).subscribe(response => {
        console.log('Delete response', response);
        this.markers = [];
        this.getShips();
        alert('Embarcación eliminada correctamente');
      });
    } else {
      alert('No se ha eliminado la embarcación');
    }
  }

  // Get all ships
  getShips() {
    this.shipService.getShips().subscribe((data: Ship[]) => {
      this.ships = data;
      this.ships.forEach((ship: Ship) => {
        console.log('Ship', ship);
        this.markers.push({
          id: ship.id,
          position: { 
            lat: ship.latIni, 
            lng: ship.lngIni, 
          },
          label: { 
            text: ship.name,
            className: 'marker-label',
           },
          title: ship.name,
          info: ship.name,
          direction: ship.direction,
          description: ship.description,
          destination: {
            lat: ship.latDest,
            lng: ship.lngDest,
          },
          icon: {
            url: 'http://localhost:4200/assets/ship.png',
          }
        });
      });
    });
  }

}
