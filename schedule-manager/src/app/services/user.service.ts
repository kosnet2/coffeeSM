import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private http: HttpClient) { }

  addUser(name, surname, alias, age, email, password, priviledge, hourly, fixed): Observable<any> {
    const obj = {
      name: name,
      surname: surname,
      alias: alias,
      age: age,
      email: email,
      password: password,
      priviledge: priviledge,
      date: {
          hourly: hourly,
          fixed: fixed,
      }
    };

    console.log(obj);
    return this.http.post(`${environment.serverUrl}/users`, obj); //add to users database
  }



  
}
