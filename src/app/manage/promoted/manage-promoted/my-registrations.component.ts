import { Component, AfterContentInit, OnInit } from '@angular/core';
import { Router, NavigationEnd, RoutesRecognized } from '@angular/router';
import { AuthService } from '../../../auth/services/auth-service';
import { ManagePromotionsService } from '../../../shared-module/services/manage-promotions.service';
import { EventService } from '../../../event/services/event-service';
// import { FirebaseListObservable } from 'angularfire2/database/firebase_list_observable';
import { AngularFireDatabase } from 'angularfire2/database/database';
import { AppService } from '../../../services/app-service';

@Component({
    template: `
        <div class="row" style="margin-top:2rem">
            <div
                class="col-md-6 col-lg-4"
                *ngFor="let attendee of attendeeList"
                promoter-registrant
                [registrantInfo]="attendee"></div>
        </div>
    `,
    styles: [

    ]

})

export class PromotedMyRegistrationsComponent implements OnInit {

    eventId: string;
    attendeeList: any[];

    constructor(private auth: AuthService,
        private router: Router,
        private af: AngularFireDatabase,
        private appService: AppService,
        private eventService: EventService,
        public promotionsService: ManagePromotionsService) {

    }

    ngOnInit() {
        this.eventId = this.eventService.eventId;

        if (this.appService.ocodeSet) {
            this.populateData();
        } else {
            this.appService.ocodeService.ocodeEmitter.subscribe((ocode) => {
                this.populateData();
            });
        }
    }

    populateData() {
        this.eventService.getAttendeesByOcode(this.appService.ocode).then((data) => {
            this.attendeeList = data;
        });
    }

}
