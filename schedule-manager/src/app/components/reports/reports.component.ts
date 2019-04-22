import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ScheduleService } from 'src/app/services/schedule.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { ScheduleRange } from 'src/app/models/scheduleRange';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  @ViewChild('picker') picker;
  users: User[] = [];
  userHours = {};
  schedule: any;
  hourCost = 0.5;
  userPriviledge: string;

  tableColumns = ['name', 'surname', 'hours', 'salary'];
  tableData = [];

  pdf: any;

  constructor(
    private ss: ScheduleService,
    private us: UserService,
    private auth: AuthService) { }


  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.auth.loadStorageToken();
      this.userPriviledge = this.auth.user.priviledge;
    }
    this.getUsers();
  }


  onMonthSelected(event) {
    this.picker.close();
    const monthRange = new ScheduleRange();

    monthRange.start = new Date(event.getFullYear(), event.getMonth(), 1);
    monthRange.end = new Date(event.getFullYear(), event.getMonth() + 1, 1);

    this.ss.getScheduleRange(monthRange).subscribe(res => {
      this.schedule = res;
      // Calculate hours
      this.calculateHours(this.schedule);
      this.configureDataTable();
    });
  }

  configureDataTable() {
    this.tableData = [];
    for (const key in this.userHours) {
      // Get the user info to be used
      const user = this.users.find((u) => {
        return u._id === key;
      });
      if (user) {
        const name = user.name;
        const surname = user.surname;
        const rate = user.rate;
        let amount = user.amount;

        if (rate === 'fixed') {
          amount = user.amount;
        } else if (rate === 'hourly') {
          amount = this.userHours[key] * +('' + user.amount);
        } else {
          amount = 0;
        }

        this.tableData.push({
          'name': name,
          'surname': surname,
          'hours': this.userHours[key],
          'salary': amount
        });
      }
    }
  }

  calculateHours(schedule) {

    for (const key in this.userHours) {
      this.userHours[key] = 0;
    }

    for (const scheduleEntry of schedule) {
      for (const user of scheduleEntry['allocatedStaff']) {
        const userId = user.split(' ')[0];
        const _user = this.users.find((u) => {
          return u._id === userId;	/// userid undefined
        });
        if (_user) {
          this.userHours[userId] += this.hourCost;
        }
      }
    }
  }

  getUsers() {
    this.us.getUsers().subscribe(res => {
      if (this.userPriviledge === 'staff') { // if a staff is logged in show individual details
        for (const r of res) {
          let user = new User();
          user = r;
          if (this.auth.user._id === user._id) {
            this.users.push(user);
            this.userHours[user._id] = 0;
          }
        }
      } else {
        for (const r of res) {				// If something is fetched
          let user = new User();			// Create new user
          user = r;									//  Place fetched user into local variable
          if (user.priviledge !== 'logistics') {		// Check if you got anything else but logistics user
            this.users.push(user);
            // Push the user into an array of users
            this.userHours[user._id] = 0;
          }
        }
      }
    });
  }

    downloadPDF() {
      const div = document.getElementById('html2Pdf');	// Get the html element for conversion based on id		// scale: 2 scale: 3, dpi: 300
      const options = { background: 'white', height: div.clientHeight, width: div.clientWidth, scale: 0.8, dpi: 1800 };

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
}
