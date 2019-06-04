import { Injectable } from '@angular/core';
import {Observable, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {ApiService} from "./api.service";
import {error} from "@angular/compiler/src/util";


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private api: ApiService) { }

  validateUserByEmail(email: string, password: string): Observable<any> {
   return this.api.getUserByEmail(email).pipe(
     map(user => {
     if(user.password === password) {
       return true;
     } else {
       throw new Error('you sent an incorrect password')
     }
    }),
     catchError(error => {
       return throwError(error)
     })
   )
  }

}
