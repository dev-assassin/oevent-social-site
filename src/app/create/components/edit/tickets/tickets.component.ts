import {Component, AfterContentInit, OnInit, Input} from '@angular/core';
import {Router, NavigationEnd, RoutesRecognized, ActivatedRoute, Params} from '@angular/router';
import {AppService} from "../../../../services/app-service";
import {AuthService} from "../../../../auth/services/auth-service";
import {CreateEventService} from "../../../services/create-event.service";
import {CreateTicketsService} from "../../../services/create-tickets.service";
import {ITicket} from "../../../models/tickets.models";

@Component({
    selector: 'event-tickets',

    template: `

        <table class="table table-striped" style="margin-top:15px;" *ngIf="ticketLength"> 
            <thead>
                <tr>
                    <td> 
                        <div class="row"> 
                            <div class="col-sm-7"> 
                                Ticket Title
                            </div>
                            <div class="col-sm-2"> 
                                Quantity
                            </div>
                            <div class="col-sm-2"> 
                                Price
                            </div>                            
                        </div>
                    </td>
                </tr>
            </thead>
            <tbody> 
                <tr *ngFor="let ticket of createTicketService.ticketList$ | async" event-ticket [ticketKey]="ticket.$key"></tr> 
            </tbody>
        </table>
        
        <div style="margin-top:25px;">
            
            <button (click)="addTicket('free')" class="btn btn-primary" style="margin-right:15px;">
                Add Free Ticket <i class="fa fa-plus-square-o"></i>    
            </button>
            
            <button (click)="addTicket('paid')" class="btn btn-primary">
                Add Paid Ticket <i class="fa fa-plus-square-o"></i>    
            </button>
            
        </div>
        
    `,
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