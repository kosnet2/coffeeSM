import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Subject } from 'rxjs';
import { MatRadioGroup, getMatInputUnsupportedTypeError } from '@angular/material';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  form: FormGroup;
  result: any;
  radio: any;
  spanDisplayed = false;
  

  constructor(private fb: FormBuilder, private us: UserService) {
    this.createForm();
  }



  


  createForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      alias: ['', Validators.required],
      age: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      priviledge: ['', Validators.required],
      hourly: ['', Validators.email],
      fixed: ['', Validators.required]
    });
  }
  ngOnInit() {
  }

  addUser(name, surname, alias, age, email, password, priviledge, hourly, fixed) {
    // subscribe part is to display the result of our post request
    this.us.addUser(name, surname, alias, age, email, password, priviledge, hourly, fixed).subscribe(res => {
      this.result = JSON.stringify(res, null, 2);
      console.log(this.result);
    });
  }
}
