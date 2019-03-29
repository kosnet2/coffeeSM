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
import { EditPositionsComponent } from './settings/edit-positions/edit-positions.component';
import { NumbersOnlyDirective } from './directives/numbers-only.directive';
import { EditUsersComponent,
         DeleteDialogComponent,
         EditDialogComponent,
         EditUnavailabilityDialogComponent } from './settings/edit-users/edit-users.component';
import { AppComponent } from './app.component';
import { SettingsComponent } from './settings/settings.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { ReportsComponent } from './reports/reports.component';

/* Application services */
import { UserService } from './services/user.service';
import { PositionsService } from './services/positions.service';

/* Styling modules -- angular material , angular flexLayout*/
import { MatInputModule,
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
         MatNativeDateModule,
         MatDialogModule,
         MatTabsModule,
         MatChipsModule,
         MatTooltipModule} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxMatDrpModule } from 'ngx-mat-daterange-picker';

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
        EditUnavailabilityDialogComponent,
        EditPositionsComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        HttpClientModule,
        FormsModule,
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
        MatNativeDateModule,
        MatDialogModule,
        MatChipsModule,
        MatTabsModule,
        MatTooltipModule,
        NgxMatDrpModule,
        FlexLayoutModule,
    ],
    providers: [UserService, PositionsService],
    bootstrap: [AppComponent],
    // the dialog components need to be declared here
    entryComponents: [DeleteDialogComponent, EditDialogComponent, EditUnavailabilityDialogComponent]
})
export class AppModule { }
