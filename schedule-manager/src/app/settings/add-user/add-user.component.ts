import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  form: FormGroup;
  constructor(private fb: FormBuilder, private us: UserService) {
    this.createForm();
  }

  createForm(){
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.email]
    });
  }
  ngOnInit() {
  }

  addUser(name, email){
    // subscribe part is to display the result of our post request
    this.us.addUser(name, email).subscribe(res => {
      console.log(res);
    });
  }
}
