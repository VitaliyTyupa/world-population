import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {User} from '../interfaces';

@Injectable()
export class ApiService {

  private configURL = 'http://localhost:5000';

  constructor(private httpClient: HttpClient) {
  }

  register(user: User): Observable<User> {
    return this.httpClient.post<User>(this.configURL + '/api/auth/register', user);
  }

  login(user: User): Observable<{token: string}> {
    return this.httpClient.post<{token: string}>(this.configURL + '/api/auth/login', user);
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
      );
  }

}
