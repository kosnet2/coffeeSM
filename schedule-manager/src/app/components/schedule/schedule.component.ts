import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { Positions} from 'src/app/models/positions';
import { SchedulePickerService } from '../../services/schedule-picker.service';
import { Schedule } from '../../models/schedule';
import { PositionsService } from '../../services/positions.service';
import { ScheduleService } from '../../services/schedule.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ScheduleRange } from 'src/app/models/scheduleRange';
import { environment } from 'src/environments/environment';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface scheduleInputDialogData {
  startTime: string;
	endTime: string;
	employeeId: string;
	
}

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})

export class ScheduleComponent implements OnInit {

	@ViewChild('picker') picker : ElementRef;
  panelOpenState = false;
  users: User[] = [];
	
	hardcodedTimes = [
	'6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00',
	'15:00','16:00', '17:00', '18:00', '19:00','20:00', '21:00', '22:00', '23:00' 
	 ];
	times: Array<Date>;
  	days = [
	'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday','Saturday','Sunday'  
	];

	

	//__________input dialog variables__________
	startTime: any;
	endTime: any;
	employeeId: any;
	Form: FormGroup;

	//__________ Dates for browsing days__________
	startDate : any;
	endDate : Date;
	currentWeek =[];
	currentPositions = [];

	//__________ Constructor__________
	constructor(
		private us: UserService, 
		private ss: ScheduleService, 
		private ps: PositionsService, 
		public dialog: MatDialog,
		private fb: FormBuilder) { } 

	//__________ On initiation__________
  ngOnInit() {
	this.getUsers();  					// When the component is loaded, users are fetched from database
	this.getPositions();				// WHen component is loaded, Positions are fetches from database
	this.loadWeeklySchedule();	// When component is loaded, The current week´s schedule is fetched from the database
	}

	//__________ Functions__________
	getUsers() {      
	this.us.getUsers().subscribe(res => {       
	  for (const r of res) {				// If something is fetched 
	  	 let user = new User();			// Create new user
	 		 user = r;									//  Place fetched user into local variable
	  	 if(user.priviledge !== 'logistics')		// Check if you got anything else but logistics user
				 this.users.push(user);			// Push the user into an array of users
	  }
	});
	}

	getPositions(){
	  this.ps.getPositions().subscribe(res => {		// Fetch positions from DB
			for(const key in res){										// For each key brught from DB
				for(let i = 1; i <= res[key]; i++){			//  						--->			 I don´t really get whats happening in here....
					this.currentPositions.push(key+i);
				}
			}
	  });
	}

	/* --> Function will be called when date is selected on date picker
	*	 1. It will calculate the first and last day of the week based on new input and
	*  2. create new time entries for the whole week with 30 min intervals.
	*  3. It will check if database has the time entries. If not, they will be created
	*/ 
	loadWeeklySchedule(){
		let today = new Date();									// Create new date object
		let start = this.getWeekStart(today);		// Function will calculate the first day of this week. That day is passed onto local variable
		let end = new Date(start);							// The first day of the week is placed into local variable
		end.setDate(end.getDate()+7);						// + 7 days are appended to the local variable, to get the last day of the week
		
		this.startDate = new FormControl(new Date(start));	// New form control is created for the start date
		this.endDate = new Date(end);			// New date object is created based on last day of the week
		this.populateWeek(start, end);		// Creates time entries for the whole week with 30 min intervals

		const range = new ScheduleRange();	 // New schedule range object is created based on model
		range.start = this.startDate.value;	// Start value is placed into the object based on the calculated start date
		range.end = this.endDate;						// End value is place into the object based on the calculated end date
		this.fetchScheduleRange(range);			// Function will query the database for the whole week´s schedule entries. If not found they will be created
	}

	fetchScheduleRange(range: ScheduleRange) {
		this.ss.getScheduleRange(range).subscribe(res => {		// Call service to query database
			if (res.length === 0){						
				this.ss.addSchedules([...this.currentWeek]).subscribe(res => { // if there is nothing in db, create schedule entries
					console.log(res);
				});
			}
			else{
				console.log('the week is there');
				// Distribute the result into the weekly array
			}
		});	
	}

	/* --> If another date is selected on date picker, this function will be called.
	*	 1. It will calculate the first and last day of the week based on new input and
	*  2. It will create new time entries for the whole week with 30 min intervals.
	*  3. It will check if database has the time entries. If not, they will be created
	*/ 
	onChangeDate(event){
		this.startDate = new FormControl( this.getWeekStart(event.value)); // Gets the new value from date picker and calculates the first day of week
		this.endDate = new Date(this.startDate.value);	
		this.endDate.setDate(this.endDate.getDate()+7);  // Calcuate new end date based on first day of week
		this.populateWeek(this.startDate.value, this.endDate ); // creates time entries for the whole week with 30 min time intervals
		const range = new ScheduleRange();	
		range.start = this.startDate.value;
		range.end = this.endDate;
		this.fetchScheduleRange(range);
	}

	/* --> Will be called byt other functions
	*	 1. It will set the hours, minutes and seconds to zero
	*  2. It will calculate the first day of week based on given day
	*/ 
	getWeekStart(d : Date): Date{
		d = new Date(d);
		d.setHours(0);
		d.setMinutes(0);
		d.setSeconds(0);

  	let day = d.getDay(),   // Will get the current day
      diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
  	return new Date(d.setDate(diff));
	}

	onSaveSchedule() {

	//const newSchedule  = this.employeeData;
	  
	const schedule = new Schedule();
	
	// this.ss.addSchedule(schedule).subscribe(res => {
	//   	if (res) {
	// 		console.log('Schedule succesfully added');
	// 	} 
	// 	else {
	// 		console.log('Schedule was not added!');
	// 	}
	//   });
	  }

		// Creates time entries for the whole week with 30 minutes intervals
		populateWeek(start: Date, end: Date): void{
			let s = new Date(start);
			let e = new Date(end);
			this.times = [];  				// Create array for storing time
			while(s <= e){						// Loop through all time values
				if(s.getHours()>= 6 && s.getHours()<= 23){				// Set the time range between 6-23
					if(!this.times.find(time =>{										// If nothing is found between 6-23
									// Create new dateTime objects and set hours and minutes equal to start time
						return new Date(time).getHours() == s.getHours() && new Date(time).getMinutes() === s.getMinutes() 
					})){
						this.times.push(new Date(s));		// Push found and created time objects into an array of times
					}

					this.currentWeek.push({				// Push objects into currentWeek array which will contain dateTime objects for each day
						'dateTime': new Date(s),		// And also an array for allocated staff
						'allocatedStaff': []
					});
				}
				s.setMinutes(s.getMinutes()+30);		// Will append 30 minutes for creating new entries with 30 min intervals
			}
		}

		debug(timeIndex, positionIndex){
			console.log(timeIndex,positionIndex);
		}

		createForm() {
			this.Form = this.fb.group({
			  	startTime: ['', Validators.required],
			  	endTime: ['', Validators.required],
			  	employeeId: ['', Validators.required], 
			});
		  }

		//__________ Dialog for input __________
	/* --> Will open a popup for user to add employee to the schedule
	*	 1. It will set the hours, minutes and seconds to zero
	*  2. It will calculate the first day of week based on given day
	*/ 
		openDialog(timeIndex, positionIndex): void {
			this.createForm();
			this.startTime = this.times[timeIndex];     // Getting selected time from grid
			const dialogRef = this.dialog.open(ScheduleInputDialog, {
				autoFocus: true,
				data: {
					"start" : this.times[timeIndex],
					"position" : this.currentPositions[positionIndex],
					"users": this.users,
				}
			});
	
			dialogRef.afterClosed().subscribe(res => {
				if (res) {
					console.log(res);
					// this.us.updateUserUnavailability(res.user).subscribe(r => {
					// 		// tslint:disable-next-line: forin
					// 		for (const key in r.user) {
					// 			this.users[index][key] = r.user[key];
					// 		}
					// 		this.snackBar.open('The user unavailability has been updated', 'OK', {
					// 			duration: 5000,
					// 			horizontalPosition: 'center',
					// 			verticalPosition: 'top',
					// 		});
					// });
				}
			});
		}
	}
  	// startTime: string;
	// endTime: string;
	// employee: string;


//_____ Schedule dialog component _____
@Component({
  selector: 'app-scheduleInputDialog',
  templateUrl: './scheduleInputDialog.html',
  styleUrls: ['./schedule.component.scss']

})
export class ScheduleInputDialog {

//__________ Variables __________	
	form: FormGroup;
	employees = [];

	//__________Constructor __________	
constructor(
		private fb: FormBuilder,
    public dialogRef: MatDialogRef<ScheduleInputDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
			this.createForm();
		}

	//__________ Functions __________	
	createForm(){
		this.form = this.fb.group({
			fromTime:[''],
			toTime:[''],
			employee:['']
		});

		const position = this.data.position.substring(0,this.data.position.length - 1);
		let from = this.data.start.getHours() < 10 ? '0' + this.data.start.getHours() : '' + this.data.start.getHours();
		from += ':';
		from += this.data.start.getMinutes() < 10 ? '0' + this.data.start.getMinutes() : '' + this.data.start.getMinutes();
		this.form.controls['fromTime'].setValue(from);

		for(const user of this.data.users)
		{
			if(user.position === position){
				this.employees.push(user);
			}
		}
		console.log(this.data);
	}

  onNoClick(): void {
    this.dialogRef.close();
	}
	
	debug(){
		console.log(this.form.value);
	}

	onYesClick(): void {
		this.dialogRef.close(this.form.value);
	}

}

