/* Angular authentication guard. If the user is not logged in, he may not browse specific routes*/
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private auth: AuthService) {}

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        return new Observable<boolean>(observer => {
            if (this.auth.token === '') {
                this.auth.loadStorageToken();
            }

            if (this.auth.isLoggedIn()) {
                observer.next(true);
                observer.complete();
                return;
            }

            this.auth.logout();
            observer.next(false);
            observer.complete();
        });
    }
}
