import { Component, Input, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import { ITicket } from '../../../create/models/tickets.models';

@Component({
    selector: 'app-registration-type-detail',
    styleUrls: [
        './_registration-type.detail.component.scss'
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
                    <strong>{{ regType.ticketsUsed }}/{{ regType.ticketQuantity }}</strong> sold
                </div>
                <div>
                    <strong>
                        {{ '$'+revenue }}
                    </strong>
                     total revenue
                </div>
            </div>
         </div>
    `
})

export class RegistrationTypeDetailComponent implements OnInit {

    @Input() regType: ITicket;
    revenue = 0;
    price: string;

    ngOnInit() {
        this.revenue = this.regType.ticketsUsed * this.regType.ticketPrice;

        if (this.regType.ticketPrice === 0) {
            this.price = 'FREE';
        }

    }

}
