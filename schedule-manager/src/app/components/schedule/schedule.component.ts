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
import { Observable } from 'rxjs';

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
	weekRange: ScheduleRange;
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
		this.initializeWeekRange(undefined);
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
			for (const key in res) {							// For each key brught from DB
				for (let i = 1; i <= res[key]; i++) {
					this.currentPositions.push(key + i);
				}
			}
			this.initializeSchedules(this.weekRange.start);
			this.fetchScheduleRange(this.weekRange);
		});
	}

	initializeSchedules(start: Date) {
		/* Initialize component containers*/
		this.times = [];
		this.currentWeek = [];
		this.currentWeekDom = [];
		const s = new Date(start);

		s.setHours(6);
		s.setMinutes(0);

		for ( let i = 0; i < 7 * this.dailyHourSlots;) {
			// Keep only the first day times
			if (i < this.dailyHourSlots) {
				this.times.push(new Date(s));
			}
			this.currentWeek.push({ dateTime: new Date(s) , allocatedStaff: []});
			s.setMinutes(s.getMinutes() + this.timeDiff);
			const prevDay = Math.floor(i / this.dailyHourSlots);
			i++;
			const nextDay = Math.floor(i / this.dailyHourSlots);
			if (prevDay !== nextDay) {
				s.setHours(6);
				s.setMinutes(0);
			}
		}

		/* Populate Dom */
		for (let i = 0; i < this.days.length; i++) {
			this.currentWeekDom.push([]);				// Pushing the days into an array
			// timeIndex
			for (let j = 0; j < this.times.length; j++) {
				this.currentWeekDom[i].push([]);		// Pushing the times into an array
				// positionIndex
				for (let k = 0; k < this.currentPositions.length ; k++) {
					this.currentWeekDom[i][j].push({
						'alias': '',
						'hovering': false,
						'id' : ''
					});		// Pushing the positions into an array
				}
			}
		}
	}
	/* --> Function will be called when date is selected on date picker
	*	 1. It will calculate the first and last day of the week based on new input and
	*  2. create new time entries for the whole week with 30 min intervals.
	*  3. It will check if database has the time entries. If not, they will be created
	*/
	initializeWeekRange(event) {
		if (event === undefined) {
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

		this.weekRange = new ScheduleRange();	 // New schedule range object is created based on model
		this.weekRange.start = this.startDate.value;	// Start value is placed into the object based on the calculated start date
		this.weekRange.end = this.endDate;						// End value is place into the object based on the calculated end date

		if (event) {
			this.fetchScheduleRange(this.weekRange);
		}
	}

	fetchScheduleRange(range: ScheduleRange) {
		this.ss.getScheduleRange(range).subscribe(res => {		// Call service to query database
			if (res.length === 0) {			// If there is nothing on database
				// populate currentWeek and then update the database
				this.populateWeek(res, true);
				this.ss.addSchedules(this.currentWeek).subscribe(r => {
					console.log('New week added');
				});		// Call service to add this current week to database as new entries
			} else {
				console.log('Week loaded');
				this.populateWeek(res, false);
			}
		});
	}

	// Creates time entries for the whole week with 30 minutes intervals
	populateWeek(schedule: any, initializing: boolean): void {

		/* Initialize user hours to zero */
		for (const key in this.userHours) {
			this.userHours[key] = 0;
		}

		let rowIndex = 0;
		if (!initializing) {
			for ( const res of schedule) {
				const dayIndex = Math.floor(rowIndex / this.dailyHourSlots);
				const timeIndex = rowIndex % this.dailyHourSlots;

				const toAdd = {
					dateTime: new Date(res['dateTime']),
					allocatedStaff: []
				};
				for (let k = 0; k < this.currentPositions.length; k++) {
					this.currentWeekDom[dayIndex][timeIndex][k].alias = '';
					this.currentWeekDom[dayIndex][timeIndex][k].id = '';
				}

				for (const staff of res['allocatedStaff']) {
					const userId = staff.split(' ')[0];
					const positionIndex = staff.split(' ')[1];
					const user = this.users.find((u) => {
						return u._id === userId;	/// userid undefined
					});
					if (user) {
						this.userHours[userId] += this.hourCost;
						this.currentWeekDom[dayIndex][timeIndex][positionIndex].alias = user.alias;
						this.currentWeekDom[dayIndex][timeIndex][positionIndex].id = user._id;
						toAdd.allocatedStaff.push(userId);
					}
				}
				this.currentWeek[rowIndex] = toAdd;
				rowIndex++;
			}
		} else {
			const s = new Date(this.weekRange.start);
			s.setHours(6);
			s.setMinutes(0);
			for ( ; rowIndex < 7 * this.dailyHourSlots; ) {
				const dayIndex = Math.floor(rowIndex / this.dailyHourSlots);
				const timeIndex = rowIndex % this.dailyHourSlots;

				const toAdd = {
					dateTime: new Date(s),
					allocatedStaff: []
				};
				for (let k = 0; k < this.currentPositions.length; k++) {
					this.currentWeekDom[dayIndex][timeIndex][k].alias = '';
					this.currentWeekDom[dayIndex][timeIndex][k].id = '';
					this.currentWeekDom[dayIndex][timeIndex][k].hovering = false;
				}

				this.currentWeek[rowIndex] = toAdd;
				s.setMinutes(s.getMinutes() + this.timeDiff);
				const prevDay = Math.floor(rowIndex / this.dailyHourSlots);
				rowIndex++;
				const nextDay = Math.floor(rowIndex / this.dailyHourSlots);
				if (prevDay !== nextDay) {
					s.setHours(6);
					s.setMinutes(0);
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
			data: {												// Data that the dialog has
				'start': this.times[timeIndex],
				'dayIndex': dayIndex,
				'position': this.currentPositions[positionIndex],
				'users': this.users,
			}
		});

		dialogRef.afterClosed().subscribe(res => {			// After dialog is closed
			if (res) {
				// update dom element
				const from = res['fromTime'];			// Get values from dialog
				const to = res['toTime'];
				const user: User = res['employee'];

				// get proper day to fill
				const start = new Date(this.currentWeek[dayIndex * this.dailyHourSlots]['dateTime']);
				start.setHours(+from.substring(0, 2));
				start.setMinutes(+from.substring(3));

				const end = new Date(this.currentWeek[dayIndex * this.dailyHourSlots]['dateTime']);
				end.setHours(+to.substring(0, 2));
				end.setMinutes(+to.substring(3));

				// we have the dayIndex 0 , the timeIndex 3
				let startIndex = dayIndex * this.dailyHourSlots + timeIndex;
				const sDate = new Date(this.currentWeek[startIndex]['dateTime']);

				// Check if this user is not already assigned
				for (; startIndex < this.currentWeek.length && sDate < end;) {
					// if the user is NOT included in the allocatedStaff we have found the starting point
					if (!this.currentWeek[startIndex]['allocatedStaff'].includes(user._id) &&
						this.currentWeekDom[dayIndex][startIndex % this.dailyHourSlots][positionIndex]['id'] === '') {
						break;
					} else {
						sDate.setMinutes(sDate.getMinutes() + this.timeDiff);
						startIndex++;
					}
				}

				// Check if the date range is valid. End - Start does not yield values <= 0
				const valid = (end.getTime() - sDate.getMinutes()) > 0;
				if (valid) {
					const eDate = new Date(sDate);
					let endIndex = startIndex;

					for (; endIndex < this.currentWeek.length && eDate < end;) {
						// If an invalid coordinate is found
						if (this.currentWeek[endIndex]['allocatedStaff'].includes(user._id) ||
							this.currentWeekDom[dayIndex][endIndex % this.dailyHourSlots][positionIndex]['id'] !== '') {
								break;
						} else { // continue searching
							endIndex++;
							eDate.setMinutes(eDate.getMinutes() + this.timeDiff);
						}
					}
					// update database
					this.ss.updateSchedule({ 'from': sDate, 'to': eDate, 'userId': user._id + ' ' + positionIndex }).subscribe(r => {
						// If the schedule has been updated
						if (r.success === true) {
							// go through all the weekly elements
							for (let i = startIndex; i < endIndex; i++) {
								this.userHours[user._id] += this.hourCost;
								this.currentWeek[i]['allocatedStaff'].push(user._id);
								this.currentWeekDom[dayIndex][i % this.dailyHourSlots][positionIndex]['alias'] = user.alias;
								this.currentWeekDom[dayIndex][i % this.dailyHourSlots][positionIndex]['id'] = user._id;
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

				// helper loop to get the range that should be updated in the db
				for (; temp < this.currentWeek.length && this.currentWeekDom[dayIndex][temp % this.dailyHourSlots][positionIndex]['id'] === userId; temp++) { }
				temp--;

				const to = new Date(this.currentWeek[temp]['dateTime']);
				// make the call
				// if all goes as god wishes make the below loop
				this.ss.removeUserFromSchedule({'from': from, 'to' : to, 'userId': userId + ' ' + positionIndex}).subscribe(r => {
					if (r.success === true) {
						for (; rowIndex <= temp; rowIndex++) {
							/*
								Remove the user from the weeklySchedule
							*/
							// Get the id in the allocatedStaff list
							const idx = this.currentWeek[rowIndex]['allocatedStaff'].findIndex(elem => elem === userId);
							const found = idx > -1;
							if (found) {
								// Remove that id from there
								this.currentWeek[rowIndex]['allocatedStaff'].splice(idx, 1);
								/*
									Remove the user from the weeklyScheduleDom
								*/
								// Get the corresponding coordinates from the dom schedule
								const domDayIdx = Math.floor(rowIndex / this.dailyHourSlots);
								const domTimeIdx = rowIndex % this.dailyHourSlots;

								// Go in a snake manner on the grid and adjust this user's element properties
								for (let posId = this.currentPositions.length - 1; posId >= 0; posId--) {
									if (this.currentWeekDom[domDayIdx][domTimeIdx][posId]['id'] === userId) {
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
		const div = document.getElementById('html2Pdf');	// Get the html element for conversion based on id		// scale: 2 scale: 3, dpi: 300
		const options = { background: 'white', height: div.clientHeight, width: div.clientWidth, scale: 1, dpi: 1800 };

		html2canvas(div, options).then((canvas) => {
			const doc = new jsPDF('l', 'mm', 'a4');		// Initialize JSPDF  l= landscape p= portrait
			const imgData = canvas.toDataURL('image/JPEG');	// Converting canvas to Image

			// addImage(imageData, format, x, y, width, height, alias, compression, rotation)
			doc.addImage(imgData, 'JPEG', 1, 1);  // Add image Canvas to PDF
			doc.internal.scaleFactor = 30;

			const pdfOutput = doc.output();
			// using ArrayBuffer will allow you to put image inside PDF
			const buffer = new ArrayBuffer(pdfOutput.length);
			const array = new Uint8Array(buffer);
			for (let i = 0; i < pdfOutput.length; i++) {
				array[i] = pdfOutput.charCodeAt(i);
			}

			const fileName = 'example.pdf';  // Name of pdf
			doc.save(fileName);	// Make file
		});
	}
	// __________ Dialog for input __________
}
