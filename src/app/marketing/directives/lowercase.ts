import { NgModel } from '@angular/forms';
import { Directive, Output, EventEmitter } from '@angular/core';

@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[ngModel][lowercase]',
    // tslint:disable-next-line:use-host-property-decorator
    host: {
        '(input)': 'onInputChange($event)'
    }
})
export class LowerCaseDirective {
    @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
    value: any;

    onInputChange($event) {
        this.value = $event.target.value.toLowerCase();
        this.ngModelChange.emit(this.value);
    }
}
