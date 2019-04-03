/* Angular required moduled */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/* Angular helper modules -- routing, forms, httpclient */
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule,
         FormsModule} from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';

/* Application components, directives */
import { AddUserComponent } from './components/settings/add-user/add-user.component';
import { EditPositionsComponent } from './components/settings/edit-positions/edit-positions.component';
import { NumbersOnlyDirective } from './directives/numbers-only.directive';
import { EditUsersComponent,
         DeleteDialogComponent,
         EditDialogComponent,
         EditUnavailabilityDialogComponent } from './components/settings/edit-users/edit-users.component';
import { AppComponent } from './app.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { ReportsComponent } from './components/reports/reports.component';
import { LoginComponent } from './components/login/login.component';

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
         MatTooltipModule,
         MatSnackBarModule} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxMatDrpModule } from 'ngx-mat-daterange-picker';
import { JwtTokenInterceptor } from './services/jwt-token-interceptor';
import { AuthErrorHandler } from './services/auth-error-handler';

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
        EditPositionsComponent,
        LoginComponent
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
        MatSnackBarModule,
        NgxMatDrpModule,
        FlexLayoutModule,
    ],
    providers: [
            UserService,
            PositionsService,
            {
                provide: HTTP_INTERCEPTORS,
                useClass: JwtTokenInterceptor,
                multi: true
            },
            {
                provide: ErrorHandler,
                useClass: AuthErrorHandler
            }],
    bootstrap: [AppComponent],
    // the dialog components need to be declared here
    entryComponents: [DeleteDialogComponent, EditDialogComponent, EditUnavailabilityDialogComponent]
})
export class AppModule { }
