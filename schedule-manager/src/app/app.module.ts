/* Angular required moduled */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/* Angular helper modules -- routing, forms, httpclient */
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule,
         FormsModule} from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';

/* Application components, directives */
import { AddUserComponent } from './settings/add-user/add-user.component';
import { NumbersOnlyDirective } from './directives/numbers-only.directive';
import { EditUsersComponent,
         DeleteDialogComponent,
         EditDialogComponent } from './settings/edit-users/edit-users.component';
import { AppComponent } from './app.component';
import { SettingsComponent } from './settings/settings.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { ReportsComponent } from './reports/reports.component';


/* Application services */
import { UserService } from './services/user.service';

/* Styling modules -- angular material , angular flexLayout*/
import { MatInputModule,
         MatButtonModule,
         MatGridListModule,
         MatCardModule,
         MatFormFieldModule,
         MatCheckboxModule,
         MatDatepickerModule,
         MatRadioModule,
         MatSelectModule,
         MatIconModule,
         MatExpansionModule,
         MatListModule,
         MatNativeDateModule,
         MatTableModule,
         MatDialogModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { EmployeeListerComponent } from './schedule/employee-lister/employee-lister.component';
import { ScheduleViewerComponent } from './schedule/schedule-viewer/schedule-viewer.component';
import { SchedulePickerService } from './services/schedule-picker.service';
import { EmployeeInfoComponent } from './schedule/employee-info/employee-info.component';
import { ScheduleService } from './services/schedule.service';

@NgModule({
    declarations: [
        AppComponent,
        SettingsComponent,
        ScheduleComponent,
        ReportsComponent,
        AddUserComponent,
        EditUsersComponent,
        NumbersOnlyDirective,
        DeleteDialogComponent,
        EditDialogComponent,
        EmployeeListerComponent,
        ScheduleViewerComponent,
        EmployeeInfoComponent
    ],
    imports: [
        BrowserModule,
        CommonModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatRadioModule,
        MatSelectModule,
        MatIconModule,
        MatExpansionModule,
        MatListModule,
        FlexLayoutModule,
        MatNativeDateModule,
        MatDialogModule,
        MatGridListModule,
        MatTableModule,
        FormsModule
    ],
    providers: [UserService, SchedulePickerService, ScheduleService],
    bootstrap: [AppComponent],
    entryComponents: [DeleteDialogComponent, EditDialogComponent]
})
export class AppModule { }
