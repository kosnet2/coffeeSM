import {Component, Input} from '@angular/core';
import { SchedulePickerService } from 'src/app/services/schedule-picker.service';
import { ScheduleService } from 'src/app/services/schedule.service';
import { Schedule } from 'src/app/models/schedule';

export interface Shifts {
	time: string;
	bar1: string;
	bar2: string;
	bar3: string;
	cashier: string;
} 

/**
 * @title Table with sticky header
 */
@Component({
	selector: 'app-schedule-viewer',
	styleUrls: ['schedule-viewer.component.scss'],
	templateUrl: 'schedule-viewer.component.html',
})
export class ScheduleViewerComponent {
	displayedColumns = ['time','bar1', 'bar2', 'bar3', 'cashier'];
	employeeData  = [
		{time: '8:00 - 9:00' , bar1 : '' , bar2 : '', bar3 : '' , cashier : ''},
		{time: '9:00 - 10:00' , bar1 : '' , bar2 : '', bar3 : '' , cashier : ''},
		{time: '10:00 - 11:00' , bar1 : '' , bar2 : '', bar3 : '' , cashier : ''},
		{time: '11:00 - 12:00' , bar1 : '' , bar2 : '', bar3 : '' , cashier : ''},
		{time: '12:00 - 13:00' , bar1 : '' , bar2 : '', bar3 : '' , cashier : ''},
		{time: '13:00 - 14:00' , bar1 : '' , bar2 : '', bar3 : '' , cashier : ''},
		{time: '14:00 - 15:00' , bar1 : '' , bar2 : '', bar3 : '' , cashier : ''},
		{time: '15:00 - 16:00' , bar1 : '' , bar2 : '', bar3 : '' , cashier : ''},
		{time: '16:00 - 17:00' , bar1 : '' , bar2 : '', bar3 : '' , cashier : ''},
		{time: '17:00 - 18:00' , bar1 : '' , bar2 : '', bar3 : '' , cashier : ''},
		{time: '18:00 - 19:00' , bar1 : '' , bar2 : '', bar3 : '' , cashier : ''},
		{time: '19:00 - 20:00' , bar1 : '' , bar2 : '', bar3 : '' , cashier : ''},
		{time: '20:00 - 21:00' , bar1 : '' , bar2 : '', bar3 : '' , cashier : ''},
		{time: '21:00 - 22:00' , bar1 : '' , bar2 : '', bar3 : '' , cashier : ''},
		{time: '22:00 - 23:00' , bar1 : '' , bar2 : '', bar3 : '' , cashier : ''},
	];

	constructor(private sps: SchedulePickerService, private ss: ScheduleService) {}

	addEmplyeeToSchedule(index, row){
		const property = row.target.classList.value.split(' ')[2].substring(11);
		const selectedUser = this.sps.getSelectedUser();
		if(property !== 'time' && selectedUser){
			this.employeeData[index][property] = selectedUser['name'] ;
		}
	}

	onSaveSchedule() {

		const newSchedule  = this.employeeData;
		const schedule = new Schedule();
	
		// tslint:disable-next-line: forin
		for (const key in newSchedule) {
		  schedule[key] = newSchedule[key];
		}

		this.ss.addSchedule(schedule).subscribe(res => {
		  if (res) {
			console.log('Schedule succesfully added');
		  } else {
			console.log('Schedule was not added!');
		  }
		});
	  }



}