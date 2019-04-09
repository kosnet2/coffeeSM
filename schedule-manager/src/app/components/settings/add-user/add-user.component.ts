import { Component, OnInit, ViewChild, ElementRef, Input, ViewChildren, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  /* References on the template */
  @ViewChild('nameInput') nameInput: ElementRef;            // name input field
  @ViewChild('passwordInput') passwordInput: ElementRef;    // password input field

  /* Inputs for this component. I am using them when I am inputting the userData in the edit-dialog component*/
  @Input() userData: User;
  @Input() modalMode = false;

  /* Events that this component might emit */
  @Output() userUpdated: EventEmitter<any> = new EventEmitter<any>();

  /* Instance of Angular reactive form */
  form: FormGroup;

  /* The below are used as iterables on html select elements */
  priviledges = ['staff', 'manager', 'logistics'];
  rates = ['hourly', 'fixed', 'unpaid'];
  positions = ['bar', 'cleaners', 'kitchen'];
  userPriviledge: string;

  constructor(
    private fb: FormBuilder,
    private us: UserService,
    private router: Router,
    private auth: AuthService,
    private snackBar: MatSnackBar) {
    this.createForm();
  }

  /*
  * Angular lifecycle function. When the component is being
  * initialized some actions take place. If we are not in modal
  * mode, the form is empty and nothing else happens. If we are
  * in modal mode, the form is being prefilled with the values
  * passed as input to this component.
  */
  ngOnInit() {
    if (this.auth.isLoggedIn()) {     // If someone is logging in
      this.auth.loadStorageToken();   // Get a token for him
      this.userPriviledge = this.auth.user.priviledge;    // Users priviledge is passed onto local variable
    }
    this.nameInput.nativeElement.focus();     // Cursor is placed onto nameInput field
    // Specific functionality to display values in the modal form
    if (this.modalMode === true && this.userData) {

      // tslint:disable-next-line: forin
      for (const key in this.form.controls) {                   // Looping through form control fields´ key values
        this.form.controls[key].setValue(this.userData[key]);   // Imported user data´s current key´s value is passed into the current form
        if (key !== 'email' && key !== 'password' && this.userPriviledge !== 'manager') {  
          this.form.controls[key].disable();  // If they person trying to log in is not manager, disable the form control
        }
        if (key === 'password') {    // If key equals to password, set all fields as empty string
          this.form.controls[key].setValue('');
        }
      }

      // mark the form as modified to pass validation and
      // submit button becomes enabled.
      this.form.markAsTouched();
      this.form.markAsDirty();
    }
  }

  /*
  * Generates a random password when a user is initially added to the system
  * and then updates the form input component.
  * Algorithm: Pick random index from a range and pick that number. O(passwordLength)
  * TODO: Later on functions like this should be added into a utilities service, which
  * will provide various algorithmic/helper functionalities to the application.
  */
  generatePassword() {
    let newPassword = '';
    const alphabet = 'abcdefghijklmnopqrstuvxyzwABCDEFGHIJKLMNOPQRSTUVXYZW0123456789';

    for (let i = 0; i < 8; i++) {
      const idx = Math.floor((Math.random() * alphabet.length));
      newPassword += alphabet[idx];
    }

    this.form.controls.password.setValue(newPassword);
    this.passwordInput.nativeElement.focus();
  }

  /*
  * This function is a standard procedure when you
  * need to work with angular reactive forms. It initializes
  * the form to have a specific structure with specific
  * validators. This makes our life easier when working with
  * forms.
  */
  createForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      alias: [''],
      email: ['', Validators.email],
      age: [''],
      priviledge: ['', Validators.required],
      position: [''],
      password: ['', Validators.minLength(4)],
      rate: ['', Validators.required],
      amount: ['', Validators.required]
    });
  }

  /*
  * This function is called only when this component is
  * rendered in normal mode.
  * For now it just prints to the log that the user has
  * been successfully added.
  * TODO In the future on success an email should be sent to the user
  *      to set up his password.
  */
  onAddUser() {
    const newUser = this.form.value;    // All key value pairs from form are passed into local variable
    const user = new User();            // Local user object is created

    // tslint:disable-next-line: forin
    for (const key in newUser) {    // Looping through all key value pairs
      user[key] = newUser[key];     // All form´s values are passed into a local object
    }

    this.us.addUser(user).subscribe(res => {    // The created user object is passed passed onto a function that will put it into the DB
      if (res) {
        this.snackBar.open('User successfully added', 'OK', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.router.navigateByUrl('/settings/editUsers');   // If adding user to DB is successfull, rerouting takes place
      } else {
        this.snackBar.open('User was not added', 'OK', {    // Else a error message is shown
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      }
    });
  }

  /*
  * Update the user based on the id.
  * Note that this function will be called on in modal mode
  * where the user details are updated.
  * In modal mode this component emits the changed user as an event
  * and the dialog component then passes the user to the edit-users
  * component. The reason for this is to update the information of
  * the specific user that is being editted on the frontend.
  */
  onUpdateUser() {
    const updatedUser = {...this.form.value};   // A copy of the values of the form is passed into a local variable
    updatedUser['_id'] = this.userData['_id'];  // A userID is passed onto a local variable

    this.us.updateUser(updatedUser).subscribe(res => {  // A local variable with userID is passed onto a function that will update it in the DB
      if (res.success === true) {
        this.userUpdated.emit(res.user);  // If successfull, the result is emitted back to the parent component
      }
    });
  }
}
