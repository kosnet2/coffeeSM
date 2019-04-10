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

@Component({
	selector: 'app-schedule',
	templateUrl: './schedule.component.html',
	styleUrls: ['./schedule.component.scss']
})

export class ScheduleComponent implements OnInit {

	@ViewChild('picker') picker: ElementRef;
	panelOpenState = false;

	users: User[] = [];
	times: Array<Date>;
	days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

	// __________input dialog variables__________
	startTime: any;
	endTime: any;
	employeeId: any;
	Form: FormGroup;

	// __________ Dates for browsing days__________
	startDate: any;
	endDate: Date;
	currentWeek = [];
	currentWeekDom = [];
	currentPositions = [];
	currentPositionsCount: any;

	// __________ Constructor__________
	constructor(
		private us: UserService,
		private ss: ScheduleService,
		private ps: PositionsService,
		public dialog: MatDialog,
		private fb: FormBuilder) { }

	// __________ On initiation__________
	ngOnInit() {
		this.getUsers();  					// When the component is loaded, users are fetched from database
		this.getPositions();				// WHen component is loaded, Positions are fetches from database
		this.loadWeeklySchedule();	// When component is loaded, The current week´s schedule is fetched from the database
	}

	// __________ Functions__________
	getUsers() {
	this.us.getUsers().subscribe(res => {
		for (const r of res) {				// If something is fetched
			let user = new User();			// Create new user
			user = r;									//  Place fetched user into local variable
			if (user.priviledge !== 'logistics') {		// Check if you got anything else but logistics user
				this.users.push(user);			// Push the user into an array of users
			}
		}
	});
	}

	getPositions() {
		this.currentPositions = [];
		this.ps.getPositions().subscribe(res => {		// Fetch positions from DB
// tslint:disable-next-line: forin
			this.currentPositionsCount = res;
			for (const key in res) {										// For each key brught from DB
				for (let i = 1; i <= res[key]; i++) {			//  						--->			 I don´t really get whats happening in here....
					this.currentPositions.push(key + i);
				}
			}
		});
	}

	/* --> Function will be called when date is selected on date picker
	*	 1. It will calculate the first and last day of the week based on new input and
	*  2. create new time entries for the whole week with 30 min intervals.
	*  3. It will check if database has the time entries. If not, they will be created
	*/
	loadWeeklySchedule() {
		const today = new Date();									// Create new date object
		const start = this.getWeekStart(today);		// Function will calculate the first day of this week. That day is passed onto local variable
		const end = new Date(start);							// The first day of the week is placed into local variable
		end.setDate(end.getDate() + 7);						// + 7 days are appended to the local variable, to get the last day of the week

		this.startDate = new FormControl(new Date(start));	// New form control is created for the start date
		this.endDate = new Date(end);			// New date object is created based on last day of the week

		const range = new ScheduleRange();	 // New schedule range object is created based on model
		range.start = this.startDate.value;	// Start value is placed into the object based on the calculated start date
		range.end = this.endDate;						// End value is place into the object based on the calculated end date
		this.fetchScheduleRange(range);			// Function will query the database for the whole week´s entries. If not found they will be created
	}

	fetchScheduleRange(range: ScheduleRange) {
		this.ss.getScheduleRange(range).subscribe(res => {		// Call service to query database
			if (res.length === 0) {
				this.populateWeek(range.start, range.end, false);
				this.ss.addSchedules([...this.currentWeek]);
			} else {
				this.populateWeek(range.start, range.end, true);
				this.currentWeek = res;
				this.distributeUsers();
			}
		});
	}

	distributeUsers() {
		// for each datetime returned from db get the users
		for (let i = 0; i < this.currentWeek.length; i++) {
			const userList = this.currentWeek[i]['allocatedStaff'];
			if (userList.length !== 0) {
				for (const userId of userList) {
				// find the userID in user list and update the grid with his alias
					const user = this.users.find((u) => {
						return u._id === userId;	/// userid undefined
					});
					if (user) {
						// day Index will be the element index / 36
						const dayIndex = Math.floor(i / 36);
						// time Index will be the element index % 36
						const timeIndex = i % 36;
						let start, end;
						if (user.position === 'bar') {
							start = 0;
							end = this.currentPositionsCount['bar'];
						} else if (user.position === 'cleaners') {
							start = this.currentPositionsCount['bar'];
							end = start + this.currentPositionsCount['cleaners'];
						} else if (user.position === 'kitchen') {
							start = this.currentPositionsCount['bar'] + this.currentPositionsCount['cleaners'];
							end = start + this.currentPositionsCount['kitchen'];
						} else if (user.priviledge === 'manager') {
							start = 0;
							end = this.currentPositions.length;
						}
						// position Index will be based on the user position and the already filled ones
						for (let k = start; k < end; k++) {
							if (this.currentWeekDom[dayIndex][timeIndex][k] === '') {
								this.currentWeekDom[dayIndex][timeIndex][k] = user['alias'];
								break;
							}
						}
					} else {
						console.log('User not found', userId);
					}
				}
			}
		}
	}


	/* --> If another date is selected on date picker, this function will be called.
	*	 1. It will calculate the first and last day of the week based on new input and
	*  2. It will create new time entries for the whole week with 30 min intervals.
	*  3. It will check if database has the time entries. If not, they will be created
	*/
	onChangeDate(event) {
		this.startDate = new FormControl( this.getWeekStart(event.value)); // Gets the new value from date picker and calculates the first day
		this.endDate = new Date(this.startDate.value);
		this.endDate.setDate(this.endDate.getDate() + 7);  // Calcuate new end date based on first day of week

		const range = new ScheduleRange();
		range.start = this.startDate.value;
		range.end = this.endDate;
		this.fetchScheduleRange(range);
	}

	/* --> Will be called byt other functions
	*	 1. It will set the hours, minutes and seconds to zero
	*  2. It will calculate the first day of week based on given day
	*/
	getWeekStart(d: Date): Date {
		d = new Date(d);
		d.setHours(0);
		d.setMinutes(0);
		d.setSeconds(0);

		const day = d.getDay(),   // Will get the current day
		diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
		return new Date(d.setDate(diff));
	}

	onSaveSchedule() {
		console.log(this.currentWeek);
	}

	// Creates time entries for the whole week with 30 minutes intervals
	populateWeek(start: Date, end: Date, exist: boolean): void {
		const s = new Date(start);
		const e = new Date(end);
		this.times = [];  				// Create array for storing time

		if (!exist) {
			this.currentWeek = [];
		}
		this.currentWeekDom = [];
		while (s <= e) {						// Loop through all time values
			if (s.getHours() >= 6 && s.getHours() <= 23) {				// Set the time range between 6-23
				if (!this.times.find(time => {										// If nothing is found between 6-23
								// Create new dateTime objects and set hours and minutes equal to start time
					return new Date(time).getHours() === s.getHours() && new Date(time).getMinutes() === s.getMinutes();
				})) {
					this.times.push(new Date(s));		// Push found and created time objects into an array of times
				}

				if (!exist) {
					this.currentWeek.push({				// Push objects into currentWeek array which will contain dateTime objects for each day
						'dateTime': new Date(s),		// And also an array for allocated staff
						'allocatedStaff': []
					});
				}
			}
			s.setMinutes(s.getMinutes() + 30);		// Will append 30 minutes for creating new entries with 30 min intervals
		}

		// dayIndex
		for (let i = 0; i < this.days.length; i++) {
			this.currentWeekDom.push([]);
			// timeIndex
			for (let j = 0; j < this.times.length; j++) {
				this.currentWeekDom[i].push([]);
				// positionIndex
				for (let k = 0; k < this.currentPositions.length; k++) {
					this.currentWeekDom[i][j].push('');
				}
			}
		}
	}

		// __________ Dialog for input __________
	/* --> Will open a popup for user to add employee to the schedule
	*	 1. It will set the hours, minutes and seconds to zero
	*  2. It will calculate the first day of week based on given day
	*/
		openDialog(dayIndex, timeIndex, positionIndex): void {
			this.startTime = this.times[timeIndex];     // Getting selected time from grid
			// tslint:disable-next-line: no-use-before-declare
			const dialogRef = this.dialog.open(ScheduleInputDialog, {
				autoFocus: true,
				data: {
					'start' : this.times[timeIndex],
					'position' : this.currentPositions[positionIndex],
					'users': this.users,
				}
			});

			dialogRef.afterClosed().subscribe(res => {
				if (res) {
					// update dom element
					const from  = res['fromTime'];
					const to = res['toTime'];
					const user = res['employee'];

					// get proper day to fill
					const start = new Date(this.startDate.value);
					start.setDate(start.getDate() + dayIndex);
					start.setHours(+from.substring(0, 2));
					start.setMinutes(+from.substring(3));

					const end = new Date(this.startDate.value);
					end.setDate(end.getDate() + dayIndex);
					end.setHours(+to.substring(0, 2));
					end.setMinutes(+to.substring(3));

					let cells = 0;
					for (let i = 0; i < this.currentWeek.length; i++) {
						if (this.currentWeek[i]['dateTime'] >= start  && this.currentWeek[i]['dateTime'] <= end) {
							if (!this.currentWeek[i]['allocatedStaff'].find(elem => elem === user['_id'])) {
								this.currentWeek[i]['allocatedStaff'].push(user['_id']);
								this.currentWeekDom[dayIndex][timeIndex + cells][positionIndex] = user.alias;
							}
							cells++;
						} else if (cells !== 0) {
							// exit the loop when done
							break;
						}
					}

					// update database
					this.ss.updateSchedule({'from': start , 'to': end, 'userId': user['_id']}).subscribe( r => {
						console.log(r);
					});
				}
			});
		}
	}

// _____ Schedule dialog component _____
@Component({
// tslint:disable-next-line: component-selector
	selector: 'app-scheduleInputDialog',
	templateUrl: './scheduleInputDialog.html',
	styleUrls: ['./schedule.component.scss']

})
// tslint:disable-next-line: component-class-suffix
export class ScheduleInputDialog {

// __________ Variables __________
	form: FormGroup;
	employees = [];

	// __________Constructor __________
constructor(
		private fb: FormBuilder,
		public dialogRef: MatDialogRef<ScheduleInputDialog>,
		@Inject(MAT_DIALOG_DATA) public data: any) {
			this.createForm();
		}

	// __________ Functions __________
	createForm() {
		this.form = this.fb.group({
			fromTime: [''],
			toTime: [''],
			employee: ['']
		});

		const position = this.data.position.substring(0, this.data.position.length - 1);
		let from = this.data.start.getHours() < 10 ? '0' + this.data.start.getHours() : '' + this.data.start.getHours();
		from += ':';
		from += this.data.start.getMinutes() < 10 ? '0' + this.data.start.getMinutes() : '' + this.data.start.getMinutes();
		this.form.controls['fromTime'].setValue(from);

		for (const user of this.data.users) {
			if (user.position === position || user.priviledge === 'manager') {
				this.employees.push(user);
			}
		}
	}

	add(diff) {
		const time = this.form.controls['fromTime'].value;
		const s = this.data.start;
		s.setHours(+time.substring(0, 2));

		const t = new Date(s);
		t.setHours(s.getHours() + diff);

		let to = t.getHours() < 10 ? '0' + t.getHours() : '' + t.getHours();
		to += ':';
		to += time.substring(3);
		this.form.controls['toTime'].setValue(to);
	}

	onNoClick(): void {
		this.dialogRef.close();
	}

	debug() {
		console.log(this.form.value);
	}

	onYesClick(): void {
		const regex: RegExp = new RegExp(/^([01][0-9]|2[0-3]):[0-5][0-9]$/g);
		const valid = regex.test(this.form.value['fromTime']) && regex.test(this.form.value['toTime']) && this.form.value['employee'] !== undefined || this.form.value['employee'] !== '';

		if (valid) {
			this.dialogRef.close(this.form.value);
		} else {
			this.dialogRef.close();
		}
	}
}

