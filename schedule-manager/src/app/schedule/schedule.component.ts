import { Component, OnInit, Inject } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { SchedulePickerService } from '../services/schedule-picker.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  constructor(private sps: SchedulePickerService) { }

  ngOnInit() {

  }
}

