import { Component } from '@angular/core';
import {
        Router,
        Event,
        NavigationStart,
        NavigationCancel,
        NavigationError,
        NavigationEnd,
      } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Coffeeology Schedule Manager';

  constructor(private router: Router) { }

  onNavigate(url) {
    this.router.navigate([url]);
  }
}
