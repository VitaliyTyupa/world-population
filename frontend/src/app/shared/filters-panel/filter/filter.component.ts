import {Component, Input, OnInit} from '@angular/core';
import {FilterGroup, FiltersPanelService} from '../filters-panel.service';


@Component({
    selector: 'wp-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.less']
})
export class FilterComponent implements OnInit {

    @Input() group: FilterGroup;

    public searchText: string;


    constructor(
        private filtersPanelService: FiltersPanelService
    ) {
    }

    ngOnInit() {

    }

    public select(value) {
        this.filtersPanelService.setFilterKey({groupName: this.group.groupName, keys: [value]});
    }

    public unselect(value) {
        this.filtersPanelService.removeFilterKey({groupName: this.group.groupName, key: value});
    }

}
