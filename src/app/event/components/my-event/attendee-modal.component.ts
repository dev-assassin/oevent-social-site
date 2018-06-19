import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastyService } from 'ng2-toasty';
import { AppService } from '../../../services/app-service';
import { AuthService } from '../../../auth/services/auth-service';
import { EventService } from '../../services/event-service';
import { AngularFireDatabase } from 'angularfire2/database/database';


@Component({
    selector: 'app-attendee-modal',
    styles: [
        `
            .login-error{padding-bottom:15px;}
            .modal-body{
                max-height: 680px;
                overflow: auto;
            }
            ul.promoters{
                padding:0;
                margin:0;
            }
                    ul.promoters>li{
                list-style: none;
                padding:0;
                margin:0;
                padding-top:1px;
            }
            .delete-ticket{
                position: absolute;
                right: -25px;
                top: 0px;
            }
            .circle-top{
                margin:0 auto;
                width:90px;
                border-radius:50%;
            }
            p{
                padding:7px 0;
            }
        `
    ],
    template: `
<div ngbModalContainer>
    <div class="modal-body" style="padding:8%;padding-bottom:30px;">

        <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()"style="margin:15px 3px;">
            <span aria-hidden="true">×</span>
        </button>

        <div class="text-center">
            <img [src]="imageURL" *ngIf="imageSet" class="circle-top"/>
        </div>

        <h3 class="line">
            {{ attendeeDisplay.firstName }} {{ attendeeDisplay.lastName }}
        </h3>

        <p *ngFor="let field of attendeeDisplay.fields">

            <strong>{{ field.label }}:</strong>
            <span *ngIf="field.label != 'Birth Date'">{{ field.value }}</span>
            <span *ngIf="field.label == 'Birth Date'">{{ field.value.month }}-{{ field.value.day }}-{{ field.value.year }}</span>
        </p>

    </div>
</div>
    `
})

export class AttendeeModalComponent {

    imageSet = false;
    imageURL: string;
    attendee: any;
    attendeeDisplay: any = {
        firstName: '',
        lastName: '',
        fields: []
    };
    uid: string;

    constructor(public appService: AppService,
        public auth: AuthService,
        private router: Router,
        private af: AngularFireDatabase,
        public activeModal: NgbActiveModal,
        private eventService: EventService) {
        this.attendee = this.eventService.modalAttendee.data;
        this.uid = this.eventService.modalAttendee.uid;

        this.af.object(`/about/${this.uid}/`).first().subscribe((aboutMe) => {
            if (aboutMe.imageSet) {
                this.imageURL = aboutMe.imageURL;
                this.imageSet = true;
            }
        });

        this.setData();

    }

    setData() {
        for (const property in this.attendee) {
            if (this.attendee.hasOwnProperty(property)) {
                if (property === 'First Name') {
                    this.attendeeDisplay.firstName = this.attendee[property];
                } else if (property === 'Last Name') {
                    this.attendeeDisplay.lastName = this.attendee[property];
                } else {
                    this.attendeeDisplay.fields.push({
                        label: property,
                        value: this.attendee[property]
                    });
                }
            }
        }
    }



    setAttendeeImage() {
        // this.af.object(``)
    }


}
