import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../../../auth/services/auth-service';
import { EventService } from '../../services/event-service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireDatabase } from 'angularfire2/database';
import { AppService } from '../../../services/app-service';
import { Registration } from '../../models/registration/Registration';
import { oEvent, IoEvent } from '../../../shared-models/oevent';
import { DisplayUtil } from '../../../utils/display-util';
declare var Quill: any;

@Component({
    selector: 'app-registration-confirmation',
    styles: [
        `
            .border-panel{
            border:1px solid #ddd;
            }
        `
    ],
    templateUrl: './registration-confirmation.component.html'
})

export class RegistrationConfirmationComponent implements OnInit, AfterViewInit {
    eventId: string;
    registration: Registration;
    description: any;
    event: IoEvent = new oEvent();
    confirmationMessageHTML: string;

    constructor(private auth: AuthService,
        private route: ActivatedRoute,
        private af: AngularFireDatabase,
        public eventService: EventService,
        public activeModal: NgbActiveModal,
        private appService: AppService) {
        this.registration = new Registration();
        this.route.params.subscribe((params: Params) => {
            this.eventId = params['id'];
        });
    }

    ngOnInit(): void {
        this.loadEventDetail(this.eventId);
        this.loadRegistrationDetail();
    }

    ngAfterViewInit() {
        this.af.object(`events/settings/${this.eventId}/Confirmation`).subscribe((data) => {

            this.description = new Quill('#description', {
                readOnly: true
            });

            this.description.setContents(data.message);
        }
        );
    }

    loadRegistrationDetail() {
        this.af.object(`/registrations/events/${this.eventId}/${this.auth.id}`).subscribe(
            (data) => {
                this.registration = data;
                console.log(this.registration);
            }
        );
    }

    loadEventDetail(eventId: string) {
        this.af.object(`/events/live/${eventId}/data`).subscribe(
            data => {
                this.event = data;
            },
            err => console.error(err),
            () => console.log('done')
        );
    }


}
