import { Injectable } from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {ApiService} from './api.service';
import {catchError} from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private api: ApiService) { }

}
