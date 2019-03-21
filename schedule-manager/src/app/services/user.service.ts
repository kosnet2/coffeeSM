import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  addUser(user: User): Observable<any> {
    console.log(user);
    return this.http.post(`${environment.serverUrl}/users`, user);  //add to users database
  }

  getUsers(): Observable<any> {
    return this.http.get(`${environment.serverUrl}/users`);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${environment.serverUrl}/users/${userId}`);
  }

  updateUser(updatedUser): Observable<any> {
    return this.http.put(`${environment.serverUrl}/users`, updatedUser);
  }
}
