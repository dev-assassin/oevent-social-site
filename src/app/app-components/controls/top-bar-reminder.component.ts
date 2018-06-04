import { Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'top-bar-reminder',
  styles: ['body'],
  templateUrl: './top-bar-reminder.component.html'
})

export class TopBarReminderComponent  {
    @Input() show:boolean;
    @Input() title:string;
    @Input() message:string;
    @Input() linkText:string;
    @Input() linkAddress:string;
    constructor() {
    }
}
