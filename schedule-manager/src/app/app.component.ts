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
  title = 'schedule-manager';
  loading = false;

  constructor(private router: Router){
    this.router.events.subscribe((event: Event) => {
       this.navigationInterceptor(event);
    });
  }

  private navigationInterceptor(event: Event): void {
    if (event instanceof NavigationStart) {
      this.loading = true;
    }
    if (event instanceof NavigationEnd) {
      this.loading = false;
    }
    if (event instanceof NavigationCancel) {
      this.loading = false;
    }
    if (event instanceof NavigationError){
      this.loading = false;
    }
  }

  onNavigate(url){
    this.router.navigate([url]);
  }
}
