import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Schedule } from '../models/schedule';

@Injectable({
 providedIn: 'root'
})

export class ScheduleService {

 constructor(private http: HttpClient) { }

 addSchedule(schedule: Schedule): Observable<any> {
   return this.http.post(`${environment.serverUrl}/schedule`, schedule);  //add to schedule database
 }

 getSchedule(): Observable<any> {
   return this.http.get(`${environment.serverUrl}/schedule`);
 }

 deleteSchedule(scheduleId: string): Observable<any> {
   return this.http.delete(`${environment.serverUrl}/schedule/${scheduleId}`);
 }

 updateSchedule(updatedSchedule): Observable<any> {
   return this.http.put(`${environment.serverUrl}/schedule`, updatedSchedule);
 }
}