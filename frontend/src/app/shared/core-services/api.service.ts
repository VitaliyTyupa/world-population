import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable()
export class ApiService {

  private configURL = 'http://localhost:3000';

  constructor(private httpClient: HttpClient) {
  }

  getUserByEmail(email: string): Observable<any> {
    const headers = new HttpHeaders()
      .set('X-Negotiation-Sim-Namespace', sessionStorage.getItem('sessionNamespace'))
      .set('X-Negotiation-Sim-Session', sessionStorage.getItem('sessionId'))
      .set('If-Modified-Since', 'Mon, 26 Jul 1997 05:00:00 GMT')
      .set('Cache-Control', 'no-cache')
      .set('Pragma', 'no-cache');

    return this.httpClient.get(`${this.configURL}/users?email=${email}`)
      .pipe(
        map(user => {
          if (user[0]) {
            return user[0];
          } else {
            throw new Error(`нет пользователя с таким email`);
          }
        })
      );
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

  registration(params): Observable<any> {
    return this.httpClient.post('http://localhost:5000/api/auth/register', params);
  }

  authorization(params): Observable<any> {
    return this.httpClient.post('http://localhost:5000/api/auth/login', params);
  }

}
