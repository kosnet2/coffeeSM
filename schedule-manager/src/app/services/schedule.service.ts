import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Schedule } from '../models/schedule';
import { ScheduleRange } from '../models/scheduleRange';

@Injectable({
 providedIn: 'root'
})

export class ScheduleService {

  constructor(private http: HttpClient) { }

  // should remove
  addSchedule(schedule: Schedule): Observable<any> {
    return this.http.post(`${environment.serverUrl}/schedule`, schedule);  // add to schedule database
  }

  addSchedules(schedules: Array<any>): Observable<any> {
    return this.http.post(`${environment.serverUrl}/schedules`, schedules);
  }

  getScheduleRange(range: ScheduleRange): Observable<any> {
    return this.http.get(`${environment.serverUrl}/schedules/${JSON.stringify(range)}`);
  }

  updateSchedule(userAddedinRange): Observable<any> {
    return this.http.put(`${environment.serverUrl}/schedules`, userAddedinRange);
  }

  removeUserFromSchedule(userRemovedFromRange): Observable<any> {
    return this.http.put(`${environment.serverUrl}/schedules/remove`, userRemovedFromRange).pipe(map(response => response));
  }
}
