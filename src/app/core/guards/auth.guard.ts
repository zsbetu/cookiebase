import { Injectable } from "@angular/core";
import { CanActivate, Router, } from "@angular/router";
import { Auth, onAuthStateChanged } from "@angular/fire/auth";
import { authState } from 'rxfire/auth';
import { Observable, from, map, tap } from "rxjs";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
    constructor(private auth: Auth, private router: Router){}

  canActivate() {
    return authState(this.auth).pipe(
      map(user => !!user),
      tap(loggedIn => {
        if (!loggedIn) this.router.navigate(['/login']);
      })
    );
  }
}