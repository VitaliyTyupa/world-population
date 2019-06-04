import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class ApiService {

  private configURL = 'http://localhost:3000';

  constructor(private httpClient: HttpClient) {
  }

  getUserByEmail(email: string): Observable<any> {
    return this.httpClient.get(`${this.configURL}/users?email=${email}`)
      .pipe(
        map(user => {
          if (user[0]) {
            return user[0];
          } else {
            throw new Error(`нет пользователя с таким email`);
          }
        })
      )
  }

  getAllLessons(): Observable<any> {
    return this.httpClient.get(`${this.configURL}/lessons`)
      .pipe(
        map(lessons => {
          if (lessons) {
            return lessons;
          } else {
            throw new Error(`нет уроков для отображения`);
          }
        })
      )
  }


}
