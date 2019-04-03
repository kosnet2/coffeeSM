import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userInfo: User = null;
  private jwtToken = '';

  constructor(private http: HttpClient, private router: Router) { }

  /* Find out when the token expires */
  getTokenExpirationDate(): Date {
    const decoded = jwt_decode(this.jwtToken);

    if (decoded.exp === undefined) {
      return null;
    }

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  /* Check if token is expired */
  isTokenExpired(): boolean {
    const date = this.getTokenExpirationDate();
    if (date === undefined) {
      return false;
    }
    return !(date.valueOf() > new Date().valueOf());
  }

  /* Load the locally stored token if the user chose to do that on login */
  loadStorageToken(): void {
    const sessionToken = sessionStorage.getItem('token');
    const localToken = localStorage.getItem('token');
    if (localToken) {
      this.jwtToken = localToken;
      this.userInfo = JSON.parse(sessionStorage.getItem('user'));
    }
  }

  /* Login request to server */
  login(email: string, password: string): Promise<any> {
    const body = {
      email: email,
      password: password
    };
    return new Promise((resolve, reject) => {
      this.http.post(`${environment.serverUrl}/users/login`, body)
        .subscribe((response: any) => {
          resolve(response);
        }, error => {
          reject(error.error || error);
        });
    });
  }

  /* Logout functionality */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    this.jwtToken = '';
    this.userInfo = null;
    this.router.navigate(['/login']);
  }

  /* token getter*/
  get token(): string {
    return this.jwtToken;
  }

  /* user getter */
  get user(): User {
    return this.userInfo;
  }

  /* token setter */
  set token(newToken: string) {
    this.jwtToken = newToken;
  }

  /* user setter */
  set user(newUser: User) {
    this.userInfo = newUser;
  }

  /* Check if the current user browsing is logged in */
  isLoggedIn(): boolean {
    return this.jwtToken > '' && !this.isTokenExpired();
  }

}
