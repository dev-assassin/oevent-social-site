import { Component, AfterContentInit, OnInit, Input } from '@angular/core';
import { Router, NavigationEnd, RoutesRecognized, ActivatedRoute, Params } from '@angular/router';
import { AppService } from "../../../../services/app-service";
import { AuthService } from "../../../../auth/services/auth-service";
import { CreateEventService } from "../../../services/create-event.service";
import { CreateTicketsService } from "../../../services/create-tickets.service";
import { ITicket } from "../../../models/tickets.models";

@Component({
    selector: '[event-ticket]',

    template: `

        <td>
            <div class="row"> 
                <div class="col-md-7"> 
                    <input [(ngModel)]="ticket.ticketTitle" class="form-control" (blur)="saveTicket()" >    
                </div>
                <div class="col-md-2"> 
                    <input [(ngModel)]="ticket.ticketQuantity" class="form-control" (blur)="saveTicket()" >    
                </div>
                <div class="col-md-2"> 
                    <div class="input-group" *ngIf="ticket.ticketType == 'paid'">
                        <div class="input-group-addon">$</div>
                        <input [ngModel]="ticket.ticketPrice " (ngModelChange)="ticket.ticketPrice=$event" class="form-control" style="margin-left:-3px;" (blur)="saveTicket()" >
                    </div>    
                </div>
                <div class="col-md-1 icons text-right"> 
                    <a (click)="toggleSettings()" style="margin-right:5px;"> 
                        <i class="fa fa-gear"></i>
                    </a>
                    
                    <a (click)="removeTicket()"> 
                        <i class="fa fa-trash"></i>
                    </a>    
                </div>
            </div>
            <div class="row padding-vertical-sm" *ngIf="ticket.open"> 
                <div class="col-md-12"> 
                    <div class="row"> 
                        <div class="col-md-6"> 
                            <label>Description</label>
                            <input class="form-control" [(ngModel)]="ticket.ticketDescription" (blur)="saveTicket()" />
                        </div>
                    </div>
                    
                    <div class="row padding-vertical-sm">
                        <div class="col-md-12"> 
                            <label style="margin-right:15px;" class="inline-label" *ngIf="ticket.ticketType == 'paid'">
                                <input type="checkbox" [(ngModel)]="ticket.refundable" (click)="saveCheckbox()" />
                                Tickets are refundable
                            </label>
                            
                            <label style="margin-right:15px;" class="inline-label">
                                <input type="checkbox" [(ngModel)]="ticket.buyMultiple"  (click)="saveCheckbox()" />
                                Registrant can buy multiple tickets
                            </label>
                            
                            <label style="margin-right:15px;" class="inline-label" *ngIf="ticket.buyMultiple">
                                <input type="checkbox" [(ngModel)]="ticket.multiRegistrant" (click)="saveCheckbox()" />
                                Require separate registration information
                            </label>
                        </div>
                    </div>
                    
                    <div class="row padding-vertical-sm" *ngIf="ticket.buyMultiple || ticket.ticketType == 'paid'"> 
                        <div class="col-md-6"> 
                            <label>Max Number of Registrants Per Ticket</label>
                            <input [(ngModel)]="ticket.maxPer" class="form-control" (blur)="saveTicket()" />
                        </div>
                        <div class="col-md-6" *ngIf="ticket.ticketType == 'paid'"> 
                            <label>PayPal Address for Ticket</label>
                            <input [(ngModel)]="ticket.payPal" class="form-control" (blur)="saveTicket()" />
                        </div>
                    </div>
                    
                </div>
            </div>
        </td>
        
        
    `,
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
    open: boolean = false;
    maxPer: number = 1;

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
        }
        else {
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