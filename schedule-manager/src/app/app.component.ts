import { Component, Output } from '@angular/core';
import {
        Router,
      } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private router: Router) { }

  onNavigate(url) {
    this.router.navigate([url]);
  }
}
