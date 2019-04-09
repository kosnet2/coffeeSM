import { Component, OnInit, Inject, Output } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { SchedulePickerService } from 'src/app/services/schedule-picker.service';

@Component({
  selector: 'app-employee-lister',
  templateUrl: './employee-lister.component.html',
  styleUrls: ['./employee-lister.component.scss']
})
export class EmployeeListerComponent implements OnInit {
  users: User[] = [];

  constructor(private us: UserService, private sps: SchedulePickerService) { }    // User service = us, needs to be placed in constuctor be to used later on

  ngOnInit() {
	this.getUsers();  // When the component is loaded, users are fetched from database
  }

  getUsers() {
	this.us.getUsers().subscribe(res => {
	  for (const r of res) {
		let user = new User();
		user = r;
		if(user.priviledge !== 'logistics')
		  this.users.push(user);
	  }
  });
  }

  onUserClicked(index){
	this.sps.setSelectedUser({...this.users[index]});
  }
}
