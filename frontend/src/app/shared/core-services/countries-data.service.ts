import { Injectable } from '@angular/core';
import {ApiService} from './api.service';
import {BehaviorSubject} from 'rxjs';

export interface Country {
  name: string;
  region: string;
  population: number;
}

@Injectable({
  providedIn: 'root'
})
export class CountriesDataService {

  private countries$: Array<any>;
  private $countries$: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  private regions$: Array<string> = [];

  constructor(
    private apiService: ApiService
  ) { }

  initialize() {
    this.apiService.getAllCountries().subscribe(countries => {
      this.regions$ = this.initRegions(countries);
      this.countries$ = countries;
      this.$countries$.next(countries);
    })
  }

  get countries(): Array<Country> {
    return this.countries$;
  }
  get $countries(): BehaviorSubject<Array<Country>> {
    return this.$countries$;
  }
  get regions(): Array<string> {
    return this.regions$;
  }

  private initRegions(countries): Array<string> {
    const regions = new Set();
    countries.forEach(country => regions.add(country.region));
    return Array.from(regions);
  }
}
