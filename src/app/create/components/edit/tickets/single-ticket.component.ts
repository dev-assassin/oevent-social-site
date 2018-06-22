import { Component, AfterContentInit, OnInit, Input } from '@angular/core';
import { Router, NavigationEnd, RoutesRecognized, ActivatedRoute, Params } from '@angular/router';
import { AppService } from '../../../../services/app-service';
import { AuthService } from '../../../../auth/services/auth-service';
import { CreateEventService } from '../../../services/create-event.service';
import { CreateTicketsService } from '../../../services/create-tickets.service';
import { ITicket } from '../../../models/tickets.models';

@Component({
    selector: 'app-event-ticket',
    templateUrl: './single-ticket.component.html',
    styles: [
        `
            .icons .fa{
                font-size:1.3em;
                color:#777;
                margin-top:9px;
            }

            .icons .fa:hover{
                color:#333;
            }

        `
    ],

})

export class SingleTicketComponent implements OnInit {

    @Input() ticketKey;
    ticketRef$: any;
    ticket: ITicket;
    open = false;
    maxPer = 1;

    constructor(private auth: AuthService,
        private appService: AppService,
        private router: Router,
        private route: ActivatedRoute,
        private createService: CreateEventService,
        private createTicketService: CreateTicketsService
    ) {

    }

    ngOnInit() {
        this.ticketRef$ = this.createTicketService.getTicketObject(this.ticketKey);

        this.ticketRef$.first().subscribe((ticket) => {
            this.ticket = ticket;
        });

    }

    toggleSettings() {
        if (this.ticket.open) {
            this.ticket.open = false;
        } else {
            this.ticket.open = true;
        }
        this.saveTicket();
    }

    removeTicket() {
        console.log('delete ticket');
        this.createTicketService.removeTicket(this.ticketKey);
    }

    saveTicket() {
        let ticket: ITicket;
        ticket = this.ticket;

        console.log(ticket);

        delete ticket.$key;
        delete ticket.$exists;

        this.ticketRef$.update(ticket);
    }

    saveCheckbox() {
        setTimeout(() => {
            this.saveTicket();
        }, 500);
    }

}
