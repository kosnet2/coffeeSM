import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { PositionsService } from '../../services/positions.service';
import { ScheduleService } from '../../services/schedule.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ScheduleRange } from 'src/app/models/scheduleRange';
import { MatDialog, MatSnackBar } from '@angular/material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DeleteEmployeeDialogComponent } from './dialogs/deleteUserDialog/deleteUserDialog.component';
import { ScheduleInputDialog } from './dialogs/scheduleInputDialog/scheduleInputDialog.component';

@Component({
	selector: 'app-schedule',
	templateUrl: './schedule.component.html',
	styleUrls: ['./schedule.component.scss'],
})

export class ScheduleComponent implements OnInit {

	@ViewChild('picker') picker: ElementRef;
	panelOpenState = false;

	users: User[] = [];
	times: Array<Date>;
	dailyHourSlots = 36;
	timeDiff = 30;
	hourCost = 0.5;
	days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
	userHours = {};

	// __________input dialog variables__________
	Form: FormGroup;
	pdf: any;

	// __________ Dates for browsing days__________
	startDate: any;		// the week start date specified on the date select
	endDate: Date;		// the week end date calculated based on start date
	currentWeek = [];	// contains weekly documents fetched from database
	currentWeekDom = [];	// contains the elements that are rendered in DOM
	currentPositions = [];	// the list of position to be rendered as columns 
	currentPositionsCount: any;	// the positions configuration that is applied currently

	// __________ Constructor__________
	constructor(
		private us: UserService,
		private ss: ScheduleService,
		private ps: PositionsService,
		public dialog: MatDialog,
		private snackBar: MatSnackBar,
		private ref: ChangeDetectorRef) { }

	// __________ On initiation__________
	ngOnInit() {
		this.getUsers();  					// Load users on init from db
		this.getPositions();				// Load positions on init from db
		this.loadWeeklySchedule(undefined);	// When component is loaded, The current week´s schedule is fetched from the database
	}

	// Functions used for initialization
	getUsers() {
	this.us.getUsers().subscribe(res => {
			for (const r of res) {				// If something is fetched
				let user = new User();			// Create new user
				user = r;									//  Place fetched user into local variable
				if (user.priviledge !== 'logistics') {		// Check if you got anything else but logistics user
					this.users.push(user);			// Push the user into an array of users
					this.userHours[user._id] = 0;
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
	loadWeeklySchedule(event) {
		if(event === undefined){
			const today = new Date();									// Create new date object
			const start = this.getWeekStart(today);		// Function will calculate the first day of this week. That day is passed onto local variable
			const end = new Date(start);							// The first day of the week is placed into local variable
			end.setDate(end.getDate() + 7);						// + 7 days are appended to the local variable, to get the last day of the week

			this.startDate = new FormControl(new Date(start));	// New form control is created for the start date
			this.endDate = new Date(end);			// New date object is created based on last day of the week
	
		} else {
			this.startDate = new FormControl(this.getWeekStart(event.value)); // Gets the new value from date picker and calculates the first day
			this.endDate = new Date(this.startDate.value);
			this.endDate.setDate(this.endDate.getDate() + 7);  // Calcuate new end date based on first day of week
		}


		const range = new ScheduleRange();	 // New schedule range object is created based on model
		range.start = this.startDate.value;	// Start value is placed into the object based on the calculated start date
		range.end = this.endDate;						// End value is place into the object based on the calculated end date
		this.fetchScheduleRange(range);			// Function will query the database for the whole week´s entries. If not found they will be created
	}

	fetchScheduleRange(range: ScheduleRange) {
		this.ss.getScheduleRange(range).subscribe(res => {		// Call service to query database
			if (res.length === 0) {			// If there is nothing on database
				this.populateWeek(range.start, range.end, false);  	// Populate from scratch
				this.ss.addSchedules([...this.currentWeek]).subscribe(r => {
					console.log(r.message);
				});		// Call service to add this current week to database as new entries
			} else {
				this.populateWeek(range.start, range.end, true);	// Populate based on db results
				this.currentWeek = res;			// Place whatever came with reponse into current week-variable
				this.distributeUsers();
			}
		});
	}


	// Creates time entries for the whole week with 30 minutes intervals
	populateWeek(start: Date, end: Date, scheduleExist: boolean): void {
		const s = new Date(start);
		const e = new Date(end);
		
		this.times = [];  // Create array for storing times
		if (!scheduleExist) { this.currentWeek = []; }	//Initialize a new array
		this.currentWeekDom = [];  // An array for current weeks data (days, times, and positions) is created
		
		while (s <= e) {						// Loop through all time values
			if (s.getHours() >= 6 && s.getHours() <= 23) {				// Set the time range between 6-23
				if (!this.times.find(time => {										// If nothing is found between 6-23
					// Create new dateTime objects and set hours and minutes equal to start time
					return new Date(time).getHours() === s.getHours() && new Date(time).getMinutes() === s.getMinutes();
				})) {
					this.times.push(new Date(s));		// Push found and created time objects into an array of times
				}

				if (!scheduleExist) {
					this.currentWeek.push({				// Push objects into currentWeek array which will contain dateTime objects for each day
						'dateTime': new Date(s),		// And also an array for allocated staff
						'allocatedStaff': []
					});
				}
			}
			s.setMinutes(s.getMinutes() + 30);		// Will append 30 minutes for creating new entries with 30 min intervals
		}

		/* Initialized dom schedule */
		// dayIndex
		for (let i = 0; i < this.days.length; i++) {
			this.currentWeekDom.push([]);				// Pushing the days into an array
			// timeIndex
			for (let j = 0; j < this.times.length; j++) {
				this.currentWeekDom[i].push([]);		// Pushing the times into an array
				// positionIndex
				for (let k = 0; k < this.currentPositions.length; k++) {
					this.currentWeekDom[i][j].push({ 'alias': '', hovering: false, 'id': '' });		// Pushing the positions into an array
				}
			}
		}
	}

	distributeUsers() {
		// for each datetime returned from db get the users
		for (let key in this.userHours){
			this.userHours[key] = 0;
		}

		// Loop each one of the week's entries
		for (let i = 0; i < this.currentWeek.length; i++) {
			// If there are assigned staff on that entry
			const userList = this.currentWeek[i]['allocatedStaff'];
			if (userList.length !== 0) {

				// Loop each one of the users
				for (const userId of userList) {
					// increment the users working hours
					this.userHours[userId] += 0.5

					// find the userID in user list and update the grid with his alias
					const user = this.users.find((u) => {
						return u._id === userId;	/// userid undefined
					});

					if (user) {
						// day Index will be the element index / 36
						const dayIndex = Math.floor(i / this.dailyHourSlots);
						// time Index will be the element index % 36
						const timeIndex = i % this.dailyHourSlots;
						let start, end;
						if (user.position === 'bar') {
							start = 0;									// if 5 bar positions, 
							end = this.currentPositionsCount['bar'];	// start from 0th column and end at 4th column
						} else if (user.position === 'cleaners') {
							start = this.currentPositionsCount['bar'];	// if 5 bar positions & 2 cleaner positions,
							end = start + this.currentPositionsCount['cleaners'];	// start from 5th column and end at 6th column
						} else if (user.position === 'kitchen') {
							start = this.currentPositionsCount['bar'] + this.currentPositionsCount['cleaners']; 
							end = start + this.currentPositionsCount['kitchen'];
						} else if (user.priviledge === 'manager') {
							start = 0;
							end = this.currentPositions.length;
						}
						// position Index will be based on the user position and the already filled ones
						for (let k = start; k < end; k++) {
							if (this.currentWeekDom[dayIndex][timeIndex][k]['alias'] === '') {
								this.currentWeekDom[dayIndex][timeIndex][k]['alias'] = user['alias'];
								this.currentWeekDom[dayIndex][timeIndex][k]['id'] = userId;
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

	// __________ General Purpose Functions__________
	
	// Sets the hovering state of an element in the grid based on the hoverState provided
	onHover(dayIndex: number, timeIndex: number, positionIndex: number, hoverState: boolean) {
		this.currentWeekDom[dayIndex][timeIndex][positionIndex]['hovering'] = hoverState;
	}

	addClass(event): void {
		event.target.className += 'buttonLikeClass';
	  }
	
	removeClass(event): void {
		event.target.className = event.target.className.replace('buttonLikeClass', '');
	  }




	// __________ Open Dialog Functions__________
	
	/* --> Will open a popup for user to add employee to the schedule
	*	 1. It will set the hours, minutes and seconds to zero
	*  2. It will calculate the first day of week based on given day
	*/
	addEmployee(dayIndex, timeIndex, positionIndex): void {		// Take indexes as parameters
		const dialogRef = this.dialog.open(ScheduleInputDialog, {  // Open the dialog
			autoFocus: true,
			data: {												//Data that the dialog has
				'start': this.times[timeIndex],
				'dayIndex': dayIndex,
				'position': this.currentPositions[positionIndex],
				'users': this.users,
			}
		});

		dialogRef.afterClosed().subscribe(res => {			// After dialog is closed
			if (res) {
				// update dom element
				const from = res['fromTime'];			//Get values from dialog
				const to = res['toTime'];
				const user : User = res['employee'];

				// get proper day to fill
				const start = new Date(this.startDate.value);		// Creating new date object with startDate´s value
				start.setDate(start.getDate() + dayIndex);
				start.setHours(+from.substring(0, 2));
				start.setMinutes(+from.substring(3));

				const end = new Date(this.startDate.value);
				end.setDate(end.getDate() + dayIndex);
				end.setHours(+to.substring(0, 2));
				end.setMinutes(+to.substring(3));					


				let cells = 0;

				let sDate, startIndex, endIndex;
				let eDate;

				let i = 0;
				for (; i < this.currentWeek.length; i++) {		
					if (new Date(this.currentWeek[i]['dateTime']) >= start && !this.currentWeek[i]['allocatedStaff'].includes(user._id)){
						sDate = new Date(this.currentWeek[i]['dateTime']);
						startIndex = i;
						break;
					}
				}

				if(sDate){
					eDate = new Date(sDate);
					eDate.setMinutes(eDate.getMinutes() + this.timeDiff);

					for (; i < this.currentWeek.length; i++) {		
						if (new Date(this.currentWeek[i]['dateTime']) <= end 
						&& !this.currentWeek[i]['allocatedStaff'].includes(user._id) 
						&& this.currentWeekDom[dayIndex][timeIndex + cells][positionIndex]['id'] === ''){
							eDate.setMinutes(eDate.getMinutes() + this.timeDiff);
							endIndex = i;
						}
					}
					// update database
					this.ss.updateSchedule({ 'from': sDate, 'to': eDate, 'userId': user._id }).subscribe(r => {
						// If the schedule has been updated
						if(r.success === true){
							// go through all the weekly elements
							for (let j = startIndex, k = 0; j < endIndex; j++, k++) {
								this.userHours[user._id] += this.hourCost;
								this.currentWeek[j]['allocatedStaff'].push(user._id);
								this.currentWeekDom[dayIndex][timeIndex + k][positionIndex]['alias'] = user.alias;
								this.currentWeekDom[dayIndex][timeIndex + k][positionIndex]['id'] = user._id;
							}
	
							this.snackBar.open('The user has been added', 'OK', {
								duration: 5000,
								horizontalPosition: 'center',
								verticalPosition: 'top',
							});
						} else {
							this.snackBar.open('The user has NOT been added', 'OK', {
								duration: 5000,
								horizontalPosition: 'center',
								verticalPosition: 'top',
							});
						}
					});
				}
			}
		});
	}
	
	/* Pops a dialog where the is asked to confirm employee removal from schedule */
	deleteEmployee(dayIndex: number, timeIndex: number, positionIndex: number, userId: string) {
		// Pop up the dialog component
		const dialogRef = this.dialog.open(DeleteEmployeeDialogComponent);
		
		dialogRef.afterClosed().subscribe(res => {
			// if the removal is confirmed
			if (res) {
				// Find the row that was clicked in the weeklySchedule
				let rowIndex = dayIndex * this.dailyHourSlots + timeIndex;
				let temp = rowIndex;
				
				// Get the start dateTime object to be used in the db update query
				const from = new Date(this.currentWeek[rowIndex]['dateTime']);
 
				// Roll it 30 minutes back to match $gt keyword of mongoDB (Deleting first element from grid selection)
				from.setMinutes( from.getMinutes() - this.timeDiff );	

				// helper loop to get the range that should be updated in the db
				for(;this.currentWeek[temp++]['allocatedStaff'].includes(userId);){ }

				const to = new Date(this.currentWeek[temp]['dateTime']);
				// make the call 
				// if all goes as god wishes make the below loop
				this.ss.removeUserFromSchedule({'from': from, 'to' : to, 'userId': userId}).subscribe(r => {
					if(r.success === true){
						for(; rowIndex < temp - 1; rowIndex++){
							/* 
								Remove the user from the weeklySchedule 
							*/
							// Get the id in the allocatedStaff list
							const idx = this.currentWeek[rowIndex]['allocatedStaff'].findIndex(elem => elem === userId);
							let found = idx > -1;
							if(found){
								// Remove that id from there
								this.currentWeek[rowIndex]['allocatedStaff'].splice(idx, 1);
								/* 
									Remove the user from the weeklyScheduleDom 
								*/
								// Get the corresponding coordinates from the dom schedule
								const domDayIdx = Math.floor(rowIndex / this.dailyHourSlots);
								const domTimeIdx = rowIndex % this.dailyHourSlots;
			
								// Go in a snake manner on the grid and adjust this user's element properties
								for(let posId = this.currentPositions.length - 1; posId >= 0; posId--){
									if(this.currentWeekDom[domDayIdx][domTimeIdx][posId]['id'] === userId){
										this.currentWeekDom[domDayIdx][domTimeIdx][posId]['id'] = '';
										this.currentWeekDom[domDayIdx][domTimeIdx][posId]['alias'] = '';
									}
								}
								
								/* 
									Decrement that employee's weekly working hours by hourCost 
								*/
								this.userHours[userId] -= this.hourCost;
							}
						}

						// Display tasty snickers bar
						this.snackBar.open('The user has been removed', 'OK', {
							duration: 5000,
							horizontalPosition: 'center',
							verticalPosition: 'top',
						});
					} else {
						// Display shitty snickers bar
						this.snackBar.open('The user has NOT been removed', 'OK', {
							duration: 5000,
							horizontalPosition: 'center',
							verticalPosition: 'top',
						});
					}
				});
			}
		});
	}

	// works but image quality is still poor.
	downloadPDF() {
		const div = document.getElementById("html2Pdf");	// Get the html element for conversion based on id		// scale: 2 scale: 3, dpi: 300
		const options = { background: "white", height: div.clientHeight, width: div.clientWidth, scale: 1, dpi: 3000 };


		html2canvas(div, options).then((canvas) => {
			let doc = new jsPDF("l", "mm", "a4");		//Initialize JSPDF  l= landscape p= portrait
			let imgData = canvas.toDataURL("image/JPEG");	//Converting canvas to Image

			// addImage(imageData, format, x, y, width, height, alias, compression, rotation)
			doc.addImage(imgData, 'JPEG', 1, 1);  //Add image Canvas to PDF
			doc.internal.scaleFactor = 30;

			let pdfOutput = doc.output();
			// using ArrayBuffer will allow you to put image inside PDF
			let buffer = new ArrayBuffer(pdfOutput.length);
			let array = new Uint8Array(buffer);
			for (let i = 0; i < pdfOutput.length; i++) {
				array[i] = pdfOutput.charCodeAt(i);
			}

			const fileName = "example.pdf";  //Name of pdf
			doc.save(fileName);	// Make file
		});
	}


	onSaveSchedule() {
		console.log(this.currentWeek);
	}

	

	// __________ Dialog for input __________
	
}




