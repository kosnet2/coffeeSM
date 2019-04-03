/* Authentication error handler, used on routing */

import { Injectable, ErrorHandler } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthErrorHandler extends ErrorHandler {
    constructor(private auth: AuthService) {
        super();
    }

    handleError(error): void {
        if (error.rejection && error.rejection.status === 401) {
            this.auth.logout();
            return;
        }

        super.handleError(error);
    }
}
