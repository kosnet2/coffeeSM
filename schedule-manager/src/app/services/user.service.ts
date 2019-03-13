import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private http: HttpClient) { }

  addUser(name, email): Observable<any> {
    const obj = {
      name: name,
      email: email
    };

    console.log(obj);
    return this.http.post(`${environment.serverUrl}/users`, obj); //add to users database
  }
}
