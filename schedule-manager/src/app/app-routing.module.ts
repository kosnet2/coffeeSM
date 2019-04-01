import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent} from './settings/settings.component';
import { ScheduleComponent} from './schedule/schedule.component';
import { ReportsComponent} from './reports/reports.component';
import { AddUserComponent } from './settings/add-user/add-user.component';
import { EditUsersComponent } from './settings/edit-users/edit-users.component';
import { EditPositionsComponent } from './settings/edit-positions/edit-positions.component';

/* The routers of the application */
const routes: Routes = [
    {
        path: 'settings',
        component : SettingsComponent,
        children: [
            { path: 'addUser' , component: AddUserComponent } ,
            { path: 'editUsers', component: EditUsersComponent },
            { path: 'editPositions', component: EditPositionsComponent }
        ]
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
