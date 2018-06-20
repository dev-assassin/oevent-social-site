import 'rxjs/add/operator/do';
import 'rxjs/add/operator/pluck';

import { Component, AfterContentInit, OnInit, Input } from '@angular/core';
import { Router, NavigationEnd, RoutesRecognized, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../../../auth/services/auth-service';
import { EventService } from '../../services/event-service';
import { IoEvent, oEvent } from '../../../shared-models/oevent';
import { PromoteModalComponent } from '../event/modals/promote-modal-component';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database'
import { AttendModalComponent } from '../event/modals/attend-modal-component';
declare var Quill: any;

@Component({
    selector: 'app-my-event-promoters',
    template: `
        <h3 class="line" style="margin-bottom:0px;">
            {{ eventService.event.title }} - Promoters
        </h3>

        <div *ngIf="set && eventService.set" class="row">
            <div promoter-details
                class="col-sm-6"
                *ngFor="let promoter of promoters$ | async"
                [eventId]="eventId"
                [ocode]="promoter.$key"
                [datetime]="promoter.datetime"
                [registrations]="promoter.registrations"></div>
        </div>
    `,
    styles: [
        `
            .c-cart-table-title{
                border-bottom: 1px solid;
                border-color: rgba(135, 151, 174, 0.15);
            }
        `
    ]

})

export class MyEventPromotersComponent implements OnInit {

    @Input() title: string;
    eventId: string;
    promoters$: any;
    set = false;

    constructor(private af: AngularFireDatabase,
        public eventService: EventService) {

    }

    ngOnInit() {

        if (this.eventService.set) {
            this.promoters$ = this.eventService.getPromoters();
            this.set = true;
        } else {
            this.eventService.eventUpdated.first().subscribe(() => {
                this.promoters$ = this.eventService.getPromoters();
                this.set = true;
            });
        }

    }
}
