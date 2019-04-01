import { Component, OnInit, ViewChild, ElementRef, Input, ViewChildren, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  /* References on the template */
  @ViewChild('hourly') hourly: ElementRef;                  // hourly radio-button
  @ViewChild('fixed') fixed: ElementRef;                    // fixed radio-button
  @ViewChild('unpaid') unpaid: ElementRef;                  // unpaid radio-button
  @ViewChild('nameInput') nameInput: ElementRef;            // name input field
  @ViewChild('passwordInput') passwordInput: ElementRef;    // password input field
  @ViewChild('hourlyInput') hourlyInput: ElementRef;        // hourly input field
  @ViewChild('fixedInput') fixedInput: ElementRef;          // fixed input field

  /* Inputs for this component. I am using them when I am inputting the userData in the edit-dialog component*/
  @Input() userData: User;
  @Input() modalMode = false;

  /* Events that this component might emit */
  @Output() userUpdated: EventEmitter<any> = new EventEmitter<any>();

  form: FormGroup;
  priviledges = ['staff', 'manager', 'logistics'];
  hRate: any;
  fRate: any;

  constructor(private fb: FormBuilder, private us: UserService) {
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
      const v = this.form.controls['rate'].value;

      // specific functionality for rates
      if (v['hourly']) {
        this.hourly['checked'] = true;
        this.hourlyInput.nativeElement.value = v['hourly'];
      } else if (v['fixed']) {
        this.fixed['checked'] = true;
        this.fixedInput.nativeElement.value = v['fixed'];
      } else {
        this.unpaid['checked'] = true;
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

    for (let i = 0; i < 8; i++){
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
      password: ['', Validators.minLength(4)],
      rate: ['', Validators.required],
    });
  }

  /*
  * This function is called only when this component is
  * rendered in normal mode.
  * For now it just prints to the log that the user has
  * been successfully added
  */
  onAddUser() {
    const newUser = this.form.value;
    const user = new User();

    // tslint:disable-next-line: forin
    for (const key in newUser) {
      user[key] = newUser[key];
    }

    // Have to do this seperately since its a nested object
    if (newUser.rate === 'unpaid') {
      user.rate = {'unpaid': true };
    } else if (newUser.rate === 'fixed') {
      user.rate = {'fixed': +this.fixedInput.nativeElement.value};  // + is for casting a string to integer
    } else if (newUser.rate === 'hourly') {
      user.rate = {'hourly': +this.hourlyInput.nativeElement.value};
    }

    this.us.addUser(user).subscribe(res => {
      if (res) {
        console.log('User succesfully added');
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
    const updatedUser = this.form.value;
    updatedUser['_id'] = this.userData['_id'];

    if (updatedUser.rate === 'unpaid'){
      updatedUser.rate = { 'unpaid' : true};
    } else if (updatedUser.rate === 'fixed') {
      updatedUser.rate = { 'fixed': +this.fixedInput.nativeElement.value };
    } else if (updatedUser.rate === 'hourly') {
      updatedUser.rate = { 'hourly': +this.hourlyInput.nativeElement.value };
    }

    this.us.updateUser(updatedUser).subscribe(res => {
      if (res.success === true) {
        this.userUpdated.emit(res.user);
      }
    });
  }
}
