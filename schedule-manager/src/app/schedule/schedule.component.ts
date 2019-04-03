import { Component, OnInit, Inject } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { Positions} from 'src/app/models/positions';
import { SchedulePickerService } from '../services/schedule-picker.service';
import { Schedule } from '../models/schedule';
import { PositionsService } from '../services/positions.service';
import { ScheduleService } from '../services/schedule.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})

export class ScheduleComponent implements OnInit {

  panelOpenState = false;
  users: User[] = [];
  times = [
	'6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00',
	'15:00','16:00', '17:00', '18:00', '19:00','20:00', '21:00', '22:00', '23:00' 
  ];
  days = [
	'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday','Saturday','Sunday'  
  ];

  
  constructor(private us: UserService, private ss: ScheduleService, private ps: PositionsService) { } 

  ngOnInit() {
	this.getUsers();  // When the component is loaded, users are fetched from database
	this.getPositions();
	}
  
	getUsers() {       // This should possibly sort the users based on their current working hours
	this.us.getUsers().subscribe(res => {       // So Expansion panel can render them in order
	  for (const r of res) {
	  let user = new User();
	  user = r;
	  if(user.priviledge !== 'logistics')
		this.users.push(user);
	  }
	});
	}

	getPositions(){
	  this.ps.getPositions().subscribe(res => {
		for (const response of res) {
		  let positions = new Positions();
		  positions = response;
		}
	  })
	}

	onSaveSchedule() {

	//const newSchedule  = this.employeeData;
	  
	const schedule = new Schedule();
	
	this.ss.addSchedule(schedule).subscribe(res => {
	  	if (res) {
			console.log('Schedule succesfully added');
		} 
		else {
			console.log('Schedule was not added!');
		}
	  });
	  }




}

