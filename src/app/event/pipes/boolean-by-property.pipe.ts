import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'booleanByProperty',
    pure: false
})
export class BooleanByPropertyPipe implements PipeTransform {
    transform(items: any[], filter: string): any {
        if (!items || !filter) {
            return items;
        }
        // filter items array, items which have boolean property are returned
        return items.filter(item => item[filter]);
    }
}
