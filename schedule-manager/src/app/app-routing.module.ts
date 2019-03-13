import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SettingsComponent} from './settings/settings.component';
import {ScheduleComponent} from './schedule/schedule.component';
import {ReportsComponent} from './reports/reports.component';

const routes: Routes = [
    {
        path: 'settings',
        component : SettingsComponent
    },
    {
        path: 'schedule',
        component : ScheduleComponent
    },
    {
        path: 'reports',
        component: ReportsComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
