import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  userPriviledge: string;
  constructor(private auth: AuthService) { }

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.auth.loadStorageToken();
      this.userPriviledge = this.auth.user.priviledge;
    }
  }
}
