import { Component, OnInit, Inject } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatSnackBar } from '@angular/material';
import { COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatChipInputEvent} from '@angular/material';
import { PresetItem, NgxDrpOptions, Range} from 'ngx-mat-daterange-picker';
import { AuthService } from 'src/app/services/auth.service';

/*
* DELETE USER DIALOG COMPONENT
*/
@Component({
  selector: 'app-delete-dialog',
  templateUrl: 'delete-dialog.component.html'
})
export class DeleteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>) { }

  /* Returns an undefined object */
  onNoClick(): void {
    this.dialogRef.close();
  }

  /* Returns an object with a positive message */
  onYesClick(): void {
    this.dialogRef.close({success: true});
  }
}


/*
* EDIT USER DIALOG COMPONENT
*/
@Component({
  selector: 'app-edit-dialog',
  templateUrl: 'edit-dialog.component.html'
})
export class EditDialogComponent implements OnInit {
  userData: any;

  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) { this.userData = data; }

  ngOnInit() { }

  /* An undefined object is returned */
  onNoClick(): void {
    this.dialogRef.close();
  }

  /* A positive message and the modified user is returned */
  onYesClick(user): void {
    this.dialogRef.close({success: true, user: user});
  }
}


/*
* EDIT USER UNAVAILABILITY DIALOG COMPONENT
*/
@Component({
  selector: 'app-edit-unavailability-dialog',
  templateUrl: 'edit-unavailability-dialog.component.html'
})
export class EditUnavailabilityDialogComponent implements OnInit {
  /* must have variables - rangedatepicker - chip list*/
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  range: Range = {fromDate: new Date(), toDate: new Date()};
  options: NgxDrpOptions;
  presets: Array<PresetItem> = [];

  /* helper variables*/
  userData: User;
  weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  timesCalled = 0;
  currentDay: Date;

  constructor(public dialogRef: MatDialogRef<EditUnavailabilityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: User
    ) { this.userData = data; }  // error is coming from here

  ngOnInit() {
    this.currentDay = new Date();
    this.currentDay.setHours(0, 0, 0);
    this.setUpDatePicker();
  }

  /* Sets up the rangedatepicker */
  setUpDatePicker() {
    const today = new Date();
    today.setHours(0, 0, 0);
    const tonight = new Date();
    tonight.setDate(tonight.getDate() + 1);
    tonight.setHours(0, 0, 0);

    this.setupPresets();
    this.options = {
      presets: this.presets,
      format: 'mediumDate',
      range: {fromDate: today, toDate: tonight},
      applyLabel: 'Submit',
      calendarOverlayConfig: {
        shouldCloseOnBackdropClick: false,
      }
    };
  }

  /* setup preset buttons on rangedatepicker */
  setupPresets() {
    const forwardDate = (numOfDays) => {
      const now = new Date();
      return new Date(now.setDate(now.getDate() + numOfDays));
    };

    const today = new Date();
    today.setHours(0, 0, 0);
    const tomorrow = forwardDate(1);
    const plus2 = forwardDate(2);
    const plus7 = forwardDate(7);
    const plus30 = forwardDate(30);
    const currMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const nextMonthEnd = new Date(today.getFullYear(), today.getMonth() + 2, 0);

    this.presets =  [
      {presetLabel: 'Today' , range: { fromDate: today, toDate: tomorrow}},
      {presetLabel: 'Tomorrow', range: { fromDate: tomorrow, toDate: plus2 }},
      {presetLabel: 'Next 7 Days', range: { fromDate: today, toDate: plus7 }},
      {presetLabel: 'Next 30 Days', range: { fromDate: today, toDate: plus30 }},
      {presetLabel: 'This Month', range: { fromDate: today, toDate: currMonthEnd }},
      {presetLabel: 'Next Month', range: { fromDate: nextMonthStart, toDate: nextMonthEnd }}
    ];
  }

  /* handler function that receives the updated date range object */
  addRequestedRange(range: Range) {
    // First time its called automatically hence the first check
    if (this.timesCalled++ > 0 && range.fromDate < range.toDate) {
      this.userData.unavailability.requested.push(range);
    }
  }

  /* removes the requested dateRange */
  removeRequestedRange(range: Range) {
    const index = this.userData.unavailability.requested.indexOf(range);
    if (index >= 0) {
      this.userData.unavailability.requested.splice(index, 1);
    }
  }

  /* adds time range  */
  addTimeRange(weekDay: string, event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    const regex: RegExp = new RegExp(/^([01][0-9]|2[0-3]):[0-5][0-9]-([01][0-9]|2[0-3]):[0-5][0-9]$/g);
    const valid = regex.test(value);

    // Add new time range
    if ((value || '').trim() && valid) {
      this.userData.unavailability.permanent[weekDay].push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  /* removes specified time range */
  removeTimeRange(weekDay: string, timeRange: string): void {
    const index = this.userData.unavailability.permanent[weekDay].indexOf(timeRange);
    if (index >= 0) {
      this.userData.unavailability.permanent[weekDay].splice(index, 1);
    }
  }

  /* returns an undefined object */
  onNoClick(): void {
    this.dialogRef.close();
  }

  /* returns a positive message and the modified user */
  onYesClick(): void {
    this.dialogRef.close({success: true, user: {...this.userData}});
  }
}



/*
* EDIT USERS COMPONENT
*/
@Component({
  selector: 'app-edit-users',
  templateUrl: './edit-users.component.html',
  styleUrls: ['./edit-users.component.scss']
})
export class EditUsersComponent implements OnInit {
  users: User[] = [];
  userPriviledge: string;
  step = -1;
  displayableUserProperties = ['name', 'surname', 'email', 'alias', 'priviledge', 'position', 'rate', 'amount', 'age'];

  constructor(
    private us: UserService,
    public dialog: MatDialog,
    private auth: AuthService,
    private snackBar: MatSnackBar) { }

  ngOnInit() { this.getUsers(); }

  /* Fetch users from db and sort them by priviledge */
  getUsers() {
    if (this.auth.isLoggedIn()) {
      this.auth.loadStorageToken();
      this.userPriviledge = this.auth.user.priviledge;
    }
    if (this.userPriviledge !== 'manager') {
      this.users.push(this.auth.user);
    } else {
      this.us.getUsers().subscribe(res => {
        for (const r of res) {
          let user = new User();
          user = r;
          this.users.push(user);
        }
        this.users.sort((a: User, b: User) => {
          return a.priviledge === b.priviledge ? 0 : a.priviledge < b.priviledge ? 1 : -1;
        });
      });
    }
  }

  /* Sets the step for the accordion. Pass -1 to close any expanded */
  setStep(index: number) {
    this.step = index;
  }

  /* Delets the user from db and dom*/
  onDeleteUser(index: number) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res && res.success === true) {
        const user = this.users[index];
        this.us.deleteUser(user['_id']).subscribe( result => {
          if (result.success === true) {
            this.snackBar.open('The user has been deleted', 'OK', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
            this.users.splice(index, 1);
            this.step = -1;
          }
        });
      }
    });
  }

  /* Shows a dialog with a form to edit user details */
  onEditUser(index: number) {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      autoFocus: true,
      minHeight: '700px',
      minWidth: '500px',
      data: {...this.users[index]}
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        // tslint:disable-next-line: forin
        for (const key in res.user) {
          this.users[index][key] = res.user[key];
          this.snackBar.open('The user has been updated', 'OK', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        }
      }
    });
  }

  /* Shows a dialog that allows editing user unavailabilities */
  onEditUserUnavailability(index: number) {
    const dialogRef = this.dialog.open(EditUnavailabilityDialogComponent, {
      autoFocus: true,
      minHeight: '700px',
      minWidth: '500px',
      data: {...this.users[index]}
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.us.updateUserUnavailability(res.user).subscribe(r => {
            // tslint:disable-next-line: forin
            for (const key in r.user) {
              this.users[index][key] = r.user[key];
            }
            this.snackBar.open('The user unavailability has been updated', 'OK', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
        });
      }
    });
  }
}
