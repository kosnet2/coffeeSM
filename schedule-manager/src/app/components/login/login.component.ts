import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    rememberMe = false;

    constructor(private fb: FormBuilder,
        private auth: AuthService,
        private _router: Router,
        public snackBar: MatSnackBar) {

        // Redirect user if already logged in
        this.auth.loadStorageToken();
        if (auth.isLoggedIn()) {
            this._router.navigate(['/schedule']);
        }
    }

    ngOnInit(): void {
        this.loginForm = this.fb.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    /*On successful login a session json web token is given to the user,
    * which is used to navigate through various components and routes
    */
    login(): void {
        this.auth.login(this.loginForm.value.email, this.loginForm.value.password).then((res: any) => {
            this.auth.user = res.user;
            this.auth.token = res.jwt_token;
            let storage;
            // if (this.rememberMe) {
            //     storage = localStorage;
            // } else {
            storage = sessionStorage;
            localStorage.removeItem('token');
            // }
            storage.setItem('token', res.jwt_token);
            storage.setItem('user', JSON.stringify(res.user));

            this._router.navigate(['/schedule']);
        }, err => {
            this.snackBar.open(err.message || 'Connection to server failed', 'OK', {
                duration: 5000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
            });
        });
    }
}
