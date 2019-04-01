import { Component, OnInit } from '@angular/core';
import { SchedulePickerService } from 'src/app/services/schedule-picker.service';
import { ScheduleService } from 'src/app/services/schedule.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-employee-info',
  templateUrl: './employee-info.component.html',
  styleUrls: ['./employee-info.component.scss']
})
export class EmployeeInfoComponent implements OnInit {

  available = true;

  constructor(private sps: SchedulePickerService, private ss: ScheduleService, private us: UserService) { }

  ngOnInit() {
 
  }

  getEmployeeAvailability(){
    const selectedUser = this.sps.getSelectedUser();

    // How do I get availability? if there are hourly unavailabilities..?

  }
  
 

}
