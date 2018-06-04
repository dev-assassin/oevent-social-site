import { Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'us-ca-state-province-select',
  styles: ['body'],
  templateUrl: './us_ca-state-province-select.component.html'
})

export class UsCaStateProvinceSelectComponent  {
    @Input() state:string;
    @Input() required:boolean = false;    
    @Output() stateChange:EventEmitter<String> = new EventEmitter<String>();
    
    constructor() {
    }

    onChange(select){
      this.state = select.value; 
      this.stateChange.next(this.state); 
    }
}
