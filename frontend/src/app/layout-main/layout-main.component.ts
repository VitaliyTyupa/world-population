import {Component, OnInit, ViewChild} from '@angular/core';
import {FiltersPanelComponent} from '../shared/filters-panel/filters-panel.component';
import {CountriesDataService} from "../shared/core-services/countries-data.service";
import {AuthService} from "../shared/core-services/auth.service";

@Component({
  selector: 'wp-layout-main',
  templateUrl: './layout-main.component.html',
  styleUrls: ['./layout-main.component.scss']
})
export class LayoutMainComponent implements OnInit {

  @ViewChild(FiltersPanelComponent) filters;

  public isOpened = false;

  constructor(
    private countriesDataService: CountriesDataService,
    public auth: AuthService
  ) { }

  ngOnInit() {
    this.countriesDataService.initialize();
  }

  public closeSideNav() {
    this.isOpened = false;
  }

  public  openSideNav() {
    this.isOpened = true;
  }

  openFilters() {
    this.filters.filterDisplay = 'block';
    this.closeSideNav();
  }

}
