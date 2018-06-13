import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'odate' })
export class ODatePipe implements PipeTransform {
    transform(value) {
        if (!value) {
            return value;
        } else {
            return moment(value).format('MM/DD/YY');
        }
    }
}
