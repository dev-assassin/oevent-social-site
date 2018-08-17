import {NgModel} from "@angular/forms";
import {Directive, Output, EventEmitter} from "@angular/core";

@Directive({
    selector: '[ngModel][lowercase]',
    host: {
        "(input)": 'onInputChange($event)'
    }
})
export class LowerCaseDirective{
    @Output() ngModelChange:EventEmitter<any> = new EventEmitter();
    value: any;

    onInputChange($event){
        this.value = $event.target.value.toLowerCase();
        this.ngModelChange.emit(this.value);
    }
}