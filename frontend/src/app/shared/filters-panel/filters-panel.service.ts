import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';



export interface Game {
    key: string;
    group: string;
    location: string;
    date: any;
    sim: string;
}

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

    private groupNames = ['key', 'group', 'location', 'date', 'sim'];
    private gameData: Array<Game>;

    private period = 720;

    constructor() {
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
      let keys = JSON.stringify(this.filterKeys$)
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
                    key.keys.push(...newKeys.keys)
                }
            });
        } else {
            this.filterKeys$.push(newKeys)
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

    /**
     * Change time range selection  for showing values
     * @param period
     */
    public changeTimePeriod(period) {
        this.period = period;
        this.gameData = this.initData(1000, this.period);
        this.fillFilterGroupsValue(this.gameData, this.filterGroups$, this.filterKeys$);
    }

    public sendFilters() {
        this.$filterKeys$.next(this.filterKeys$);
    }

    public initialize(): void {
        this.filterGroups$ = this.initFilterGroups(this.groupNames);
        this.filterKeys$ = this.initFilterKeys();
        this.gameData = this.initData(1000, this.period);
        this.fillFilterGroupsValue(this.gameData, this.filterGroups$, this.filterKeys$);

    }

    /**
     * Make sets values for all filter groups depends on chosen filter keys
     * sort values in groups
     * @param data
     * @param filterGroups
     * @param filterKeys
     */
    private fillFilterGroupsValue(data: Array<Game>, filterGroups: Array<FilterGroup>, filterKeys = []): void {
        let groupValues = {}; // temporary groups values by Set
        filterGroups.forEach(group => {
            groupValues[group.groupName] = new Set;
        });
        // Sort out each data item
        data.forEach(item => {
            if (filterKeys.length > 0) {
                this.implementFilterKeys(groupValues, item, filterKeys);
            } else {
                for (let key in groupValues) {
                    groupValues[key].add(item[key])
                }
            }
        });

        //add filterKeys to FilterGroups
        filterGroups.forEach(group => {
            group.filterKeys.length = 0;
            if (filterKeys.length > 0) {
                filterKeys.forEach(key => {
                    if (key.groupName === group.groupName) {
                        group.filterKeys.push(...key.keys);
                    }
                })
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
            for (let key in filterGroups) {
                if (filterGroups.hasOwnProperty(key) && keyGroupNames.indexOf(key) === -1) {
                    filterGroups[key].add(dataItem[key]);
                }
            }
        }
    }

    private initFilterKeys(): any {
      let keys = localStorage.getItem('filter-keys');
      keys = keys ? JSON.parse(keys) : [];
      console.log(keys);
      return keys;
    }

    private initFilterGroups(groupNames): Array<FilterGroup> {
        const filterGroups = groupNames.map(name => {
            return {title: this.initTitle(name), groupName: name, filterKeys: [], values: []}
        });
        return filterGroups;
    }
    private initTitle(groupName: string) {
        switch(groupName) {
            case 'key':
                return 'Key';
            case 'group':
                return 'Group';
            case 'location':
                return 'Location';
            case 'date':
                return 'Event';
            case 'sim':
                return 'Sim'
        }
    }

    // *****************************init virtual games data**********************************************************
    countries = ["Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory", "Brunei Darussalam", "Bulgaria", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Christmas Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo", "Congo, the Democratic Republic of the", "Cook Islands", "Costa Rica", "Cote d'Ivoire", "Croatia (Hrvatska)", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands (Malvinas)", "Faroe Islands", "Fiji", "Finland", "France", "France Metropolitan", "French Guiana", "French Polynesia", "French Southern Territories", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran (Islamic Republic of)", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, Democratic People's Republic of", "Korea, Republic of", "Kuwait", "Kyrgyzstan", "Lao, People's Democratic Republic", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libyan Arab Jamahiriya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia, The Former Yugoslav Republic of", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia, Federated States of", "Moldova, Republic of", "Monaco", "Mongolia", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Romania", "Russian Federation", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Georgia and the South Sandwich Islands", "Spain", "Sri Lanka", "St. Helena", "St. Pierre and Miquelon", "Sudan", "Suriname", "Svalbard and Jan Mayen Islands", "Swaziland", "Sweden", "Switzerland", "Syrian Arab Republic", "Taiwan, Province of China", "Tajikistan", "Tanzania, United Republic of", "Thailand", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Zimbabwe"];
    groups = ["Algeria Co", "American Sam", "Andorra & Me", "Korea Corp", "Kuwait consulting", "Kyrgyzstan Gaz", "Urug & Wuay", "Uzbekistan Neft", "Vanuatu building", "Venezuela Co", "Viet  Man",];
    sims = ['Residential Lease', 'Digit-600', 'Aspect Commercial Lease', 'Aspect Commercial Lease', 'PAS', 'Analytic Prophets', 'Essentialz Supply', 'APU', 'Cyber Security', 'Cyber Security', 'Iridium', 'Iridium', 'Printer Leasing', 'Weatherstrips'];
    keys = ["Burk", "Bur", "Camb", "Heard", "Holy", "Uras", "Kong", "Huny", "I", "In", "Philip", "Pit", "Pol", "Port", "Rico", "Qat", "Reun", "U.S.", "Isl", "West", "Ye", "Yug",];

    dataCategories = [{key: "Arm", group: 'Armenia c', location: "Armenia", date: 'Sun May 05 2018', sim: "Iridium"},
        {key: "Ukr", group: "Ukraine c", location: "Ukraine", date: 'Tue Nov 06 2019', sim: "Iridium"},
        {key: "Ukr", group: "Ukraine c", location: "Ukraine", date: 'Mon May 28 2018', sim: "Aspect Commercial Lease"},
        {key: "Ukr", group: "Ukraine c", location: "Ukraine", date: 'Fri Mar 02 2018', sim: "Residential Lease"},
        {key: "Port", group: "Algeria Co", location: "United States", date: 'Thu Sep 06 2018', sim: "Weatherstrips"},
        {key: "In", group: "Andorra & Me", location: "Jordan", date: 'Fri May 25 2018', sim: "Aspect Commercial Lease"},
        {key: "Heard", group: "Korea Corp",location: "Kuwait",date: 'Sun May 27 2018',sim: "Aspect Commercial Lease"},
        {key: "Arm", group: "Armenia", location: "Armenia", date: 'Tue May 01 2019', sim: "Weatherstrips"},
        {key: "U.S.", group: "Kyrgyzstan Gaz", location: "Austria", date: 'Sat Oct 27 2018', sim: "Iridium"},
        {key: "West",group: "Uzbekistan Neft",location: "French Polynesia",date: 'Fri Jun 22 2018',sim: "Aspect Commercial Lease"}];
    private initData(count: number, period: number): Array<Game> {
        const data = [];
        for (let i = 0; i < count; i++) {
            data.push(this.initGame(period));
        }
        return data;
    }

    private initGame(period: number): Game {
        const key = this.keys[this.randomIndex(this.keys)];
        const group = this.groups[this.randomIndex(this.groups)];
        const location = this.countries[this.randomIndex(this.countries)];
        const sim = this.sims[this.randomIndex(this.sims)];
        const date = this.getDate(period);
        return {key, group, location, date, sim}
    }

    private randomIndex(data: Array<string>): number {
        let index = Math.round(Math.random() * data.length);
        return index === data.length ? index - 1 : index;
    }

    private getDate(period: number): Date {
         let range =1000 * 60 * 60 * 24 * period;
        const date = Date.now() - (Math.random() * range);

        return new Date(date)
    }
}
