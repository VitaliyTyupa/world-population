import {Component, HostBinding, OnInit} from '@angular/core';
import {FiltersPanelService} from './filters-panel.service';


@Component({
  selector: 'wp-filters',
  templateUrl: './filters-panel.component.html',
  styleUrls: ['./filters-panel.component.less']
})
export class FiltersPanelComponent implements OnInit {

  @HostBinding('style.display')
  private filterDisplay: string = 'block';

  public filterGroups: any;
  public timeSelection: any = 0;
  public isApplied: boolean = false;

  constructor(
      public filtersPanelService: FiltersPanelService
  ) { }

  ngOnInit() {
    this.filtersPanelService.initialize();
    this.filtersPanelService.$filterGroups.subscribe(groups => {
      this.filterGroups = groups;
      this.isApplied = false;
    })
  }

  /**
   * Clear all selection in filter groups
   */
  public clearFilters(): void {
   this.filtersPanelService.clearFilters();
  }

  /**
   *  Time range selection  for showing values
   */
  public selectTimesPeriod(): void {
    this.filtersPanelService.changeTimePeriod(this.timeSelection);
  }

  /**
   *  Init state for 'apply' button after click
   */
  public applyFilters(): void {
    this.filtersPanelService.sendFilters();
    this.isApplied = true;
    this.closeFilter();
  }

  public closeFilter(): void {
    this.filterDisplay = 'none';
  }
}
