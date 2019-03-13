import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  form: FormGroup;
  result: any;
  constructor(private fb: FormBuilder, private us: UserService) {
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.email]
    });
  }
  ngOnInit() {
  }

  addUser(name, email) {
    // subscribe part is to display the result of our post request
    this.us.addUser(name, email).subscribe(res => {
      this.result = JSON.stringify(res, null, 2);
      console.log(this.result);
    });
  }
}
