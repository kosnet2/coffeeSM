import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PositionsService } from 'src/app/services/positions.service';
import { Positions } from 'src/app/models/positions';

@Component({
  selector: 'app-edit-positions',
  templateUrl: './edit-positions.component.html',
  styleUrls: ['./edit-positions.component.scss']
})
export class EditPositionsComponent implements OnInit {

  /* Angular reactive form instance */
  form: FormGroup;

  /* helper variables */
  positions: Positions;

  constructor(private fb: FormBuilder, private ps: PositionsService) { 
    this.createForm();
  }

  /*
  * When the component is being initialized
  * fetch the positions values from db and
  * fill up the form
  */
  ngOnInit() {
    this.positions = new Positions();
    this.ps.getPositions().subscribe(positions => {
      if (positions) {
        this.positions = positions;
        // tslint:disable-next-line: forin
        for (const key in this.positions) {
          if (key in this.form.controls) {
            this.form.controls[key].setValue(this.positions[key]);
          }
        }
        this.form.markAsDirty();
        this.form.markAsTouched();
      }
    });
  }

  /* Create the form. In this case everything is required */
  createForm() {
    this.form = this.fb.group({
      bar: ['', Validators.required],
      cleaners: ['', Validators.required],
      kitchen: ['', Validators.required]
    });
  }

  /*
  * When the user accepts the changes
  * the positions in the database are updated
  */
  onUpdatePositions() {
    // tslint:disable-next-line: forin
    for (const key in this.form.value) {
      this.positions[key] = this.form.value[key];
    }

    this.ps.updatePositions(this.positions).subscribe(res => {
      if (res) {
        console.log(res);
      }
    });
  }
}
