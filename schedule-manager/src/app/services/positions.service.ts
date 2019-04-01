import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PositionsService {

  constructor(private http: HttpClient) { }

  /* Makes http call to get positions from database */
  getPositions(): Observable<any> {
    return this.http.get(`${environment.serverUrl}/positions`);
  }

  /* Makes http call to updated the positions with the updated positions */
  updatePositions(updatedPositions): Observable<any> {
    return this.http.put(`${environment.serverUrl}/positions`, updatedPositions);
  }
}
