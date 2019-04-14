import { MatDialogRef } from "@angular/material";
import { Component } from "@angular/core";

@Component({
	selector: 'app-delete-dialog',
	templateUrl: './deleteUserDialog.component.html',

 })
 export class DeleteEmployeeDialogComponent {
	constructor(
	  public dialogRef: MatDialogRef<DeleteEmployeeDialogComponent>) { }
 
	/* Returns an undefined object */
	onNoClick(): void {
	  this.dialogRef.close();
	}
 
	/* Returns an object with a positive message */
	onYesClick(): void {
	  this.dialogRef.close({success: true});
	}
 }