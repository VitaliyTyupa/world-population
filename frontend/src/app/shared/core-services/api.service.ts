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

  getAllCountries(): Observable<any> {
    return this.httpClient.get(`https://restcountries.eu/rest/v2/all`)
      .pipe(
        map(countries => {
          if (countries) {
            return countries;
          } else {
            throw new Error(`нет информации по Вашему запросу`);
          }
        })
      )
  }


}
