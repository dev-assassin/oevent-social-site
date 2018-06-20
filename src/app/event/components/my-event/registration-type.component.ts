import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event-service';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
    selector: 'app-my-event-registration-type',
    template: `
        <h3 class="line" style="margin-bottom:0px;">
            {{ eventService.event.title }} - Registration Types
        </h3>

        <div class="row row-eq-height">
            <div
                *ngFor="let regType of eventService.eventTickets$ | async"
                registration-type-detail
                [regType]="regType"
                class="col-md-4"></div>
        </div>

    `,
    styles: [
        ``
    ]

})

export class MyEventRegistrationTypesComponent implements OnInit {

    constructor(public eventService: EventService) {

    }

    ngOnInit() {

    }
}
