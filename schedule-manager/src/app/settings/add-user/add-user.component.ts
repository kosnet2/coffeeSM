import { Component, OnInit, ViewChild, ElementRef, Input, ViewChildren, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';
import { Router } from '@angular/router';

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

  constructor(private fb: FormBuilder, private us: UserService, private router: Router) {
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
    this.nameInput.nativeElement.focus();
    // Specific functionality to display values in the modal form
    if (this.modalMode === true && this.userData) {

      // tslint:disable-next-line: forin
      for (const key in this.form.controls) {
        this.form.controls[key].setValue(this.userData[key]);
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
    const newUser = this.form.value;
    const user = new User();

    // tslint:disable-next-line: forin
    for (const key in newUser) {
      user[key] = newUser[key];
    }

    this.us.addUser(user).subscribe(res => {
      if (res) {
        console.log('User succesfully added');
        this.router.navigateByUrl('/settings/editUsers');
      } else {
        console.log('User was not added!');
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
    const updatedUser = {...this.form.value};
    updatedUser['_id'] = this.userData['_id'];

    this.us.updateUser(updatedUser).subscribe(res => {
      if (res.success === true) {
        this.userUpdated.emit(res.user);
      }
    });
  }
}
