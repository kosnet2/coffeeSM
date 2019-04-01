import { Injectable } from '@angular/core';

@Injectable({
 providedIn: 'root'
})
export class SchedulePickerService {

 selectedUser: {};
 constructor() { }

 setSelectedUser(user){
           this.selectedUser = user;
 }

 getSelectedUser(){
           return this.selectedUser;
 }
}