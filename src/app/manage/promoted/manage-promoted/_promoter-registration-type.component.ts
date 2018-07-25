import { Component, Input, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import { ITicket } from '../../../create/models/tickets.models';
import { EventService } from '../../../event/services/event-service';
import { AppService } from '../../../services/app-service';

@Component({
    selector: 'app-promoter-registration-type-detail',
    styles: [
        `
            .reg-type{
              display:block;
              border:1px solid #dedede;
              padding-bottom:2rem;
            }

            .reg-type h3{
                font-size:1.25rem;
                display:block;
                text-align:center;
                color:#26C6DA;
                text-transform: uppercase;
                padding:.75rem 0;
                margin:0;
                border-bottom:1px solid #dedede;
            }

            .reg-body{
                padding:1rem;
                padding-top:2rem;
            }
        `
    ],
    template: `
        <div class="reg-type">
            <h3>{{ regType.ticketTitle }}</h3>
            <div class="reg-body">
                <div>
                    Price:
                    <strong *ngIf="regType.ticketType !== 'free'">{{ regType.ticketPrice | currency:'USD':true:'1.2-2' }}</strong>
                    <strong *ngIf="regType.ticketType == 'free'">FREE</strong>
                </div>
                <div>
                    <br />
                    <strong>{{ attendees.length }}</strong> registered
                    <br /><br />
                </div>

                <div *ngIf="attendees.length">
                    You are in the top {{ percentage }}% of promoters for this registration type!
                </div>

                <div *ngIf="!attendees.length">
                    You have no registrations for this ticket type!
                </div>

            </div>

         </div>
    `
})

export class PromoterRegistrationTypeDetailComponent implements OnInit {

    @Input() regType: ITicket;
    attendees: any[] = [];
    totalPromotedAttendees: any[] = [];
    private ocode: string;
    percentage = 0;

    constructor(private eventService: EventService,
        private appService: AppService) {

    }

    ngOnInit() {
        if (this.appService.ocodeSet) {
            this.ocode = this.appService.ocode;
            this.populateRegistration();
        } else {
            this.appService.ocodeService.ocodeEmitter.first().subscribe(() => {
                this.ocode = this.appService.ocode;
                this.populateRegistration();
            });
        }
    }

    populateRegistration() {
        this.eventService.getAttendeesByTypeAndOcode(this.ocode, this.regType.ticketTitle).then((data: any) => {
            this.attendees = data.attendees;
            this.totalPromotedAttendees = data.totalPromotedAttendees;
            this.calculatePerc();
        });
    }

    calculatePerc() {
        if (this.regType.ticketsUsed !== 0 && this.attendees.length) {
            this.percentage = Math.round((this.attendees.length / this.totalPromotedAttendees.length) * 100);
        } else {
            this.percentage = 0;
        }
    }

}
