import { Component, OnInit, Inject } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig } from '@angular/material';


@Component({
  selector: 'app-delete-dialog',
  templateUrl: 'delete-dialog.component.html'
})
export class DeleteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>) { }

  /*
  * When the user presses on the No button
  * the dialog returns an object with negative message.
  * Expected behavior: onNoClick() no changes should take place on the user
  */
  onNoClick(): void {
    this.dialogRef.close({success: false});
  }

  /*
  * When the users presses on the Yes button
  * the dialog returns an object with a positive message.
  * Expected behavior: onYesClick() the changes should be applied.
  */
  onYesClick(): void {
    this.dialogRef.close({success: true});
  }
}

/*
* Nested component which is standard procedure for
* opening an angular dialog component. In this case
* it is the Edit modal where the current user that
* is being edited is passed on.
* Functionality for what happens when the modal is
* succesfully opened or closed is defined.
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

  /*
  * On Cancel/No/Abort an object with a negative message is returned;
  */
  onNoClick(): void {
    this.dialogRef.close();
  }

  /*
  * On Accept/Yes/Ok an object with a positive message and the updated
  * user is returned.
  */
  onYesClick(user): void {
    this.dialogRef.close({success: true, user: user});
  }
}


@Component({
  selector: 'app-edit-users',
  templateUrl: './edit-users.component.html',
  styleUrls: ['./edit-users.component.scss']
})
export class EditUsersComponent implements OnInit {
  users: User[] = [];
  step = -1;

  constructor(private us: UserService, public dialog: MatDialog) { }

  ngOnInit() { this.getUsers(); }

  /*
  * Get the list of users from db.
  * Sort them by priviledge and same the result
  * in `users` array. The function should be called
  * only when the component is first rendered.
  */
  getUsers() {
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

  /*
  * Sets the step index to the one specified.
  * It is used to know which accordion item should be expanded or
  * if we want to close and expanded user.
  * @params index: -1 to close all any other positive number for
  * a specific user
  */
  setStep(index: number) {
    this.step = index;
  }

  /*
  * Find out the class properties of a user (since they might vary)
  * and return them as an iterable to be rendered on HTML.
  * For this case we need the properties [1 - length - 3] since
  * 0: ObjectId assigned from Mongo
  * length - 3: Document creation date
  * length - 2: Document update date
  * length - 1: mongoDb _v stamp
  * The above fields are unnecessary for rendering
  * TODO: This function should be added to the utility service, that
  * we will create later
  */
  public getClassProperties(user: User) {
    const properties = Object.getOwnPropertyNames(user);
    return properties.slice(1, properties.length - 3);
  }

  /*
  * On delete user button click, a modal pops up that asks if the
  * user will be deleted. If the result is positive the user is
  * deleted from the database and the user is removed from the
  * array in this components scope. If the result is negative
  * nothing happens.
  */
  onDeleteUser(index: number) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res && res.success === true) {
        const user = this.users[index];
        this.us.deleteUser(user['_id']).subscribe( result => {
          if (result.success === true) {
            this.users.splice(index, 1);
            this.step = -1;
          }
        });
      }
    });
  }

  /*
  * When a user is selected to be edited, a modal dialog
  * pops up, which allows a user to be edited.
  * If the user is indeed updated, I update the the users
  * variable that was rendered before the changes happen.
  */
  onEditUser(index: number) {
    // Standard Angular modal code for initializing a dialog and passing information to it.
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = {...this.users[index]};

    const dialogRef = this.dialog.open(EditDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        // tslint:disable-next-line: forin
        for (const key in res.user) {
          this.users[index][key] = res.user[key];
        }
      }
    });
  }
}
