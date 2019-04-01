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

  /* Make http call to add the user */
  addUser(user: User): Observable<any> {
    return this.http.post(`${environment.serverUrl}/users`, user);
  }

  /* Make http call to get the users */
  getUsers(): Observable<any> {
    return this.http.get(`${environment.serverUrl}/users`);
  }

  /* Make http call to delete a specified user */
  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${environment.serverUrl}/users/${userId}`);
  }

  /* Make http call to update a specific user. The whole user object needs to be passed. */
  updateUser(updatedUser): Observable<any> {
    return this.http.put(`${environment.serverUrl}/users`, updatedUser);
  }
}
