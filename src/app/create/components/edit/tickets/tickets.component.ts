import {Component, AfterContentInit, OnInit, Input} from '@angular/core';
import {Router, NavigationEnd, RoutesRecognized, ActivatedRoute, Params} from '@angular/router';
import {AppService} from "../../../../services/app-service";
import {AuthService} from "../../../../auth/services/auth-service";
import {CreateEventService} from "../../../services/create-event.service";
import {CreateTicketsService} from "../../../services/create-tickets.service";
import {ITicket} from "../../../models/tickets.models";

@Component({
    selector: 'event-tickets',
    templateUrl: './tickets.component.html',
    styles: [
        `
            :host{
                display:block;
            }  
            
            .lookup-location-wrapper{
                position:relative;
                top:-7px;
            }
        `
    ],

})

export class EditTicketsComponent implements OnInit{

    tickets:ITicket[];
    ticketLength:number = 0;

    constructor(private auth: AuthService,
                private appService: AppService,
                private router: Router,
                private route: ActivatedRoute,
                private createService:CreateEventService,
                public createTicketService:CreateTicketsService
    ) {

    }

    ngOnInit(){
        this.createTicketService.ticketList$.subscribe((data)=>{
            this.ticketLength = data.length;
        });
    }

    addTicket(ticketType){
        this.createTicketService.addTicket(ticketType);
        this.createService.showSavedDraft();
    }

    updateTicket(){

    }

    deleteTicket(){

    }


}