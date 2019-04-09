import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent} from './components/settings/settings.component';
import { ScheduleComponent} from './components/schedule/schedule.component';
import { ReportsComponent} from './components/reports/reports.component';
import { AddUserComponent } from './components/settings/add-user/add-user.component';
import { EditUsersComponent } from './components/settings/edit-users/edit-users.component';
import { EditPositionsComponent } from './components/settings/edit-positions/edit-positions.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './services/auth.guard';

/* The routers of the application */
const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'settings',
        component : SettingsComponent,
        children: [
            { path: 'addUser' , component: AddUserComponent } ,
            { path: 'editUsers', component: EditUsersComponent },
            { path: 'editPositions', component: EditPositionsComponent }
        ],
        canActivate: [
           AuthGuard
        ]
    },
    {
        path: 'schedule',
        component : ScheduleComponent,
        // canActivate: [
        //     AuthGuard
        // ]
    },
    {
        path: 'reports',
        component: ReportsComponent,
        canActivate: [
            AuthGuard
        ]
    },
    {
        path: '**', // redirect to schedule, we could also have a 404 page not found here
        redirectTo: 'schedule'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
