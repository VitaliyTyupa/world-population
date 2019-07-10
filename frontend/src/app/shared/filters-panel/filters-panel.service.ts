import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ApiService} from '../core-services/api.service';
import {map} from 'rxjs/operators';
import {CountriesDataService, Country} from "../core-services/countries-data.service";


export interface FilterKey {
    groupName: string;
    keys: Array<string>;
}

export interface FilterGroup {
    title: string;
    groupName: string;
    filterKeys: Array<string>;
    values: Array<string>;
}

@Injectable({
    providedIn: 'root'
})
export class FiltersPanelService {

    private filterGroups$: Array<FilterGroup> = [];
    private filterKeys$: Array<FilterKey> = [];
    private $filterGroups$: BehaviorSubject<Array<FilterGroup>> = new BehaviorSubject(this.filterGroups$);
    private $filterKeys$: BehaviorSubject<Array<FilterKey>> = new BehaviorSubject(this.filterKeys$);

    private groupNames = ['name', 'region'];
    private gameData: Array<Country>;

    private period = 720;

    constructor(
      private apiService: ApiService,
      private countriesDataService: CountriesDataService
    ) {
    }

    get filterGroups(): Array<FilterGroup> {
        return this.filterGroups$;
    }

    get filterKeys(): Array<FilterKey> {
        return this.filterKeys$;
    }

    /**
     * Save to storage state filter keys
     */
    public saveFilterKeys() {
      const keys = JSON.stringify(this.filterKeys$);
      localStorage.setItem('filter-keys', keys);
    }

    /**
     * Add new selected key to set filter keys
     * @param newKeys
     */
    public setFilterKey(newKeys: FilterKey) {
        if (this.filterKeys$.some(key => key.groupName === newKeys.groupName)) {
            this.filterKeys$.forEach(key => {
                if (key.groupName === newKeys.groupName) {
                    key.keys.push(...newKeys.keys);
                }
            });
        } else {
            this.filterKeys$.push(newKeys);
        }
        this.saveFilterKeys();
        this.fillFilterGroupsValue(this.gameData, this.filterGroups$, this.filterKeys$);
    }

    /**
     * Remove selected key from set filter keys
     * @param selectedKey
     */
    public removeFilterKey(selectedKey) {
        this.filterKeys$.forEach((key, id, arr) => {
            if (key.groupName === selectedKey.groupName) {
                const index = key.keys.indexOf(selectedKey.key);
                key.keys.splice(index, 1);
                if (key.keys.length === 0) {
                    arr.splice(id, 1);
                }
            }
        });
        this.saveFilterKeys();
        this.fillFilterGroupsValue(this.gameData, this.filterGroups$, this.filterKeys$);
    }

    get $filterGroups(): BehaviorSubject<Array<FilterGroup>> {
        return this.$filterGroups$;
    }

    get $filterKeys(): BehaviorSubject<Array<FilterKey>> {
        return this.$filterKeys$;
    }

    public clearFilters() {
        this.filterKeys$.length = 0;
        this.period = 720;
        this.saveFilterKeys();
        this.initialize();
    }

    public sendFilters() {
        this.$filterKeys$.next(this.filterKeys$);
    }

    public initialize(): void {
        this.filterGroups$ = this.initFilterGroups(this.groupNames);
        this.filterKeys$ = this.initFilterKeys();
        this.countriesDataService.$countries.subscribe(countries => {
        this.gameData = countries;
        this.fillFilterGroupsValue(this.gameData, this.filterGroups$, this.filterKeys$);
      });
    }

    /**
     * Make sets values for all filter groups depends on chosen filter keys
     * sort values in groups
     * @param data
     * @param filterGroups
     * @param filterKeys
     */
    private fillFilterGroupsValue(data: Array<Country>, filterGroups: Array<FilterGroup>, filterKeys = []): void {
        const groupValues = {}; // temporary groups values by Set
        filterGroups.forEach(group => {
        groupValues[group.groupName] = new Set;
        });
      // Sort out each data item
        data.forEach(item => {
            if (filterKeys.length > 0) {
                this.implementFilterKeys(groupValues, item, filterKeys);
            } else {
                for (const key in groupValues) {
                    groupValues[key].add(item[key]);
                }
            }
        });

        // add filterKeys to FilterGroups
        filterGroups.forEach(group => {
            group.filterKeys.length = 0;
            if (filterKeys.length > 0) {
                filterKeys.forEach(key => {
                    if (key.groupName === group.groupName) {
                        group.filterKeys.push(...key.keys);
                    }
                });
            }
            group.values.length = 0;
            group.values.push.apply(group.values, Array.from(groupValues[group.groupName]));
            // Sort values in group
            if (group.groupName === 'date') {
                group.values.sort((a: any, b: any) => {
                    return a - b;
                });
            } else {
                group.values.sort();
            }
        });
        this.$filterGroups$.next(filterGroups);
    }

    private implementFilterKeys(filterGroups, dataItem, filterKeys) {
        let allowAddValues = true;
        const keyGroupNames = [];
        filterKeys.forEach(key => {
            keyGroupNames.push(key.groupName);
            if (allowAddValues) {
                if (key.keys.indexOf(dataItem[key.groupName]) === -1) {
                    filterGroups[key.groupName].add(dataItem[key.groupName]);
                }
                allowAddValues = key.keys.some(val => val === dataItem[key.groupName]);
            }
        });
        if (allowAddValues) {
            for (const key in filterGroups) {
                if (filterGroups.hasOwnProperty(key) && keyGroupNames.indexOf(key) === -1) {
                    filterGroups[key].add(dataItem[key]);
                }
            }
        }
    }

    private initFilterKeys(): any {
      let keys = localStorage.getItem('filter-keys');
      keys = keys ? JSON.parse(keys) : [];
      return keys;
    }

    private initFilterGroups(groupNames): Array<FilterGroup> {
        const filterGroups = groupNames.map(name => {
            return {title: this.initTitle(name), groupName: name, filterKeys: [], values: []};
        });
        return filterGroups;
    }
    private initTitle(groupName: string) {
        switch (groupName) {
            case 'name':
                return 'Name';
            case 'region':
                return 'Region';
            case 'population':
                return 'Population';
        }
    }
}
