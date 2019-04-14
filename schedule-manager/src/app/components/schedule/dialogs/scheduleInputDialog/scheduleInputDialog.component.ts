import { Component, Output, Inject } from "@angular/core";
import { EventEmitter } from "events";
import { FormGroup, FormBuilder } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

// _____ Schedule dialog component _____
@Component({
	// tslint:disable-next-line: component-selector
	selector: 'app-scheduleInputDialog',
	templateUrl: './scheduleInputDialog.component.html',
})
// tslint:disable-next-line: component-class-suffix
export class ScheduleInputDialog {

    // __________ Variables __________
	form: FormGroup;
    
    // Will be used as an iterator list for select input
    employees = [];

    // Will be used to render error messages on user unavailabilities
	unavailabilities = {    
		'perm': {
			'day': '',
			'msg': ''
		}, 
		'req':{
			'from': '',
			'to': ''
		} 
	};

	// __________Constructor __________
	constructor(
		private fb: FormBuilder,
		public dialogRef: MatDialogRef<ScheduleInputDialog>,
		@Inject(MAT_DIALOG_DATA) public data: any) {
		this.createForm();
	}

    // __________ Functions __________
    /* Create the form and initialize its values */
	createForm(): void{
        // Set form structure
		this.form = this.fb.group({
			fromTime: [''],
			toTime: [''],
			employee: ['']
		});

        // Get position of column entered to know which staff to render on select 
        const pos = this.data.position.substring(0, this.data.position.length - 1);
        
        // Make time inputs uniform visually
        const h = this.data.start.getHours();
        const m = this.data.start.getMinutes();

		let from = (h < 10 ? '0' + h : '' + h) + ':' + (m < 10 ? '0' + m : '' + m);
		this.form.controls['fromTime'].setValue(from); // Set form input fromTime 

        // Set form select list to the users that are eligible for that position
		for (const user of this.data.users) {
			if (user.position === pos || user.priviledge === 'manager') {
				this.employees.push(user);
			}
		}
	}

    /* On button click add the difference to the fromTime to get the toTime value*/
	add(diff: number): void{
        const fromTime = this.form.controls['fromTime'].value;
		const from = this.data.start;

        from.setHours(+fromTime.substring(0, 2));  // setting the hour is done to avoid user changing input
		const to = new Date(from);
		to.setHours(from.getHours() + diff);    //add the hours
        const h = to.getHours();
		let toTime = (h < 10 ? '0' + h : '' + h) + ':' + fromTime.substring(3);
        
        // Add the difference in the toTime input field
        this.form.controls['toTime'].setValue(toTime);
	}

    /* Adjusts unavailability status to be used for error messages */
	showUnavailabilityInfo(employee: any){
		const days = ['monday', 'tuesday','wednesday','thursday','friday','saturday','sunday'];
        const dayIndex = this.data.dayIndex;
        const dayTitle = days[dayIndex];
		const start = this.data.start;
		const employeeUnavailability = employee.value['unavailability'];
        
        // Get which day is requested to check
        start.setDate(start.getDate() + dayIndex);

		// Check permanent unavailability 
		const perm = employeeUnavailability['permanent'];

        // If there exists an unavailability on days like this
        // then render the unavaialabilities
		if(perm[dayTitle].length > 0){
			this.unavailabilities['perm']['day'] = dayTitle;
			for(let range of perm[dayTitle]){
				this.unavailabilities['perm']['msg'] += range + ' , '				  
			}

            this.unavailabilities['perm']['msg'] = 
                this.unavailabilities['perm']['msg'].substring(0, this.unavailabilities['perm']['msg'].length - 3); 
		}

        // Check requested unavailability
        const requested = employeeUnavailability['requested'];
        
        // If the date being assigned to the employee falls
        // between the fromDate - toDate range, display the
        // error message
		for(let req of requested){
			if(start >= new Date(req['fromDate']) && start <= new Date(req['toDate'])){
				this.unavailabilities['req']['from'] = req['fromDate'];
				this.unavailabilities['req']['to'] = req['toDate'];
			}
		}
    }
    
    /* On decline changes user input*/
	onNoClick(): void {
		this.dialogRef.close();
	}

    /* On accept changes user input*/
	onYesClick(): void {

        // Validate user inputs, in case of mistake
		const regex: RegExp = new RegExp(/^([01][0-9]|2[0-3]):[0-5][0-9]$/g);
		const valid = regex.test(this.form.value['fromTime']) && regex.test(this.form.value['toTime']) && this.form.value['employee'] !== undefined || this.form.value['employee'] !== '';

        // If the form is valid return its values to the caller
		if (valid) {
			this.dialogRef.close(this.form.value);
        } else {    // Just close the modal with no changes
			this.dialogRef.close();
		}
	}
}