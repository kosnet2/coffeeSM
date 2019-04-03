import { Component } from '@angular/core';
import {
        Router,
        Event,
        NavigationStart,
        NavigationCancel,
        NavigationError,
        NavigationEnd,
      } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Coffeeology Schedule Manager';

  constructor(private router: Router, private auth: AuthService) { }

  onNavigate(url) {
    this.router.navigate([url]);
  }

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  logout(): void {
    this.auth.logout();
  }
}
