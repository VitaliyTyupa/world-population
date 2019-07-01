import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'filter'
})
export class FilterPipe implements PipeTransform {

    transform(items: any, searchText?: any): any {

        if (!items) return [];
        if (!searchText) return items;
        searchText = searchText.toString().toLowerCase();
        let newList = items.filter(item => {
            item = item.toString().toLowerCase();
            return item.indexOf(searchText) !== -1;
        });
        if(typeof newList[0] === 'string') {
            let regExp = new RegExp(searchText,'g');
            for (let i = 0; i < newList.length; i++) {
                newList[i] = newList[i].toLowerCase();
                newList[i] = newList[i].replace(regExp, (str) => {
                    return '<b>' + str + '</b>';
                });
            }
        }
        return newList;
    }

}
