import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ship } from './ship';

@Injectable({
  providedIn: 'root'
})
export class ShipService {
  public baseUrl = "http://localhost:3030/ships";

  constructor(private httpClient: HttpClient) { }

  // Get all ships
  public getShips(): Observable<any> { 
    return this.httpClient.get(this.baseUrl); 
  }

  // Get ship detail
  public getShip(id: number): Observable<any> { 
    return this.httpClient.get(this.baseUrl + "/" + id); 
  }

  // Add a new ship
  public addShip(ship: any): Observable<any> {
    console.log(ship);
    return this.httpClient.post(this.baseUrl, ship, { responseType: 'text' });
  }

  // Update a ship
  public updateShip(ship: any): Observable<any> {
    let id = ship.id;
    ship.id = undefined;
    return this.httpClient.put(this.baseUrl + "/" + id, ship, { responseType: 'text' });
  }

  // Delete a ship by id
  public deleteShip(id: number): Observable<any> {
    return this.httpClient.delete(this.baseUrl + "/" + id, { responseType: 'text' });
  }
}
