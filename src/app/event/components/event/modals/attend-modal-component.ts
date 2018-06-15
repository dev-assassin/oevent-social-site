import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "../../../../auth/services/auth-service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { AppService } from "../../../../services/app-service";
import {ToastyService} from "ng2-toasty";
import {EventService} from "../../../services/event-service";
import {IEventRegistration, EventRegistration} from "../../../models/event-registration";
import {ITicket} from "../../../../create/models/tickets.models";

@Component({
    selector: 'attend-modal',
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
            
            .ticket-title{
                color: #26C6DA;
                font-size: 20px;
            }
            
            .ticket-title span{
                color:#333;
            }
            
            .ticket-input .btn-narrow{
                padding-left: .35rem;
                padding-right: .15rem;
            }
            
            .ticket-input .input-group input{
                padding-left: 2px;
                padding-right: 2px;
                text-align: center;
            }
            
            .real-small{
                font-size:.75rem;
            }
            
            hr{
                margin-top: .25rem;
                margin-bottom: .5rem;
            }
            
        `
    ],
    templateUrl: './attend-modal.html'
})

export class AttendModalComponent {

    tickets$:any;
    registered:boolean = false;
    attending$:any;
    attender:boolean = false;
    ticketQty:any = [];
    ticketQtyErr:any = [];
    tickets:any[] = [];
    ticketTotal:number = 0;
    ticketsGroomed:any[] = [];
    ticketsValid:boolean = false;

    //THIS IS THE MAIN REGISTRATION - registration.children are the sub-registrations
    registration:IEventRegistration = new EventRegistration();

    //KEEP TRACK IF DATA LOADED FROM FIREBASE TO SHOW/HIDE *ngIf INFO.
    set:boolean = false;

    constructor(public appService: AppService,
                public auth: AuthService,
                private router: Router,
                public activeModal: NgbActiveModal,
                private eventService: EventService) {

        this.tickets$ = this.eventService.getTickets();

        this.attending$ = this.eventService.attending();

        //THIS CAN PROBABLY JUST BE REMOVED LATER
        this.set = true;

        if(this.eventService.refOcode)
        {
            this.registration.ocode = this.eventService.refOcode;
        }

        this.tickets = [];

        this.tickets$.first().subscribe((tickets)=>{

            for(let ticket of tickets){

                this.groomTicket(ticket);

                this.tickets.push({
                    quantity:0,
                    name:"",
                    price:0,
                    key:""
                });

                this.ticketQty[ticket.$key] = 0;
                this.ticketQtyErr[ticket.$key] = {
                    error:false,
                    limit:false,
                    total:false
                }

            }
        });

    }

    groomTicket(ticket:ITicket){
        this.ticketsGroomed.push(ticket);
    }

    register(){

        this.registered = true;
        this.eventService.setPromoter(this.registration.ocode).then(()=>{

        });

    }

    updateTicket(ticket:ITicket, index, single:boolean = false, type:string = 'none'){

        let ticketQty:number;

        if(ticket.buyMultiple && type == 'none'){

           ticketQty = parseInt(this.ticketQty[ticket.$key]);
           if(typeof ticketQty == "undefined"){
               ticketQty = 0;
           }
        }
        else if(type == 'plus'){

            ticketQty = parseInt(this.ticketQty[ticket.$key]);
            if(typeof ticketQty == "undefined"){
                ticketQty = 0;
            }

            ticketQty++;
            this.ticketQty[ticket.$key] = ticketQty;

        }
        else if(type == 'minus'){
            ticketQty = parseInt(this.ticketQty[ticket.$key]);

            if(typeof ticketQty == "undefined"){
                ticketQty = 0;
            }

            if(ticketQty>0){
                ticketQty--;
            }

            this.ticketQty[ticket.$key] = ticketQty;
        }
        else{
            ticketQty = 1;
        }

        if(ticketQty <= ticket.ticketsLeft && ticketQty <= ticket.maxPer){

            this.ticketQtyErr[ticket.$key] = {
                error:false,
                total:false,
                limit:false
            };

            this.ticketsValid = true;

            let quantity:number;
            let name = ticket.ticketTitle;
            let description = ticket.ticketDescription;
            let key = ticket.$key;

            if(!single){
                quantity = parseInt(this.ticketQty[ticket.$key]);
            }
            else{
                quantity = 1;
            }


            let price = ticket.ticketPrice * quantity;
            let unitPrice = ticket.ticketPrice;

            let test = {
                description:description,
                quantity:quantity,
                name:name,
                price:price,
                key:key,
                unitPrice:unitPrice
            };

            this.tickets[index] = test;

            this.updateTotal();
        }

        else{

            this.ticketQtyErr[ticket.$key].error = true;
            this.ticketsValid = false;

            if(ticketQty >= ticket.ticketsLeft){
                this.ticketQtyErr[ticket.$key].total = true;
            }

            if(ticketQty >= ticket.maxPer){
                this.ticketQtyErr[ticket.$key].limit = true;
            }

        }

    }

    removeTicket(index){
        this.tickets[index].quantity = 0;
        this.updateTotal();
    }

    registerTickets(){
        this.eventService.currentTickets = this.tickets;
        this.eventService.ticketTotal = this.ticketTotal;
        this.eventService.persistInformation();
        this.eventService.clearSingleInput();
        this.eventService.setFields().then(()=>{
            //this.eventService.buildTicketRegistration();
            this.router.navigateByUrl(`/register/${this.eventService.eventId}`);
            this.activeModal.dismiss();
        });
    }

    updateTotal(){

        let total:number = 0;

        for(let ticket of this.tickets){
            if(ticket.quantity){
                total += ticket.price;
            }
        }
        this.ticketTotal = total;

        this.checkTickets()
    }

    checkTickets(){

        let quantity = 0;

        for(let ticket of this.tickets){
            quantity += ticket.quantity;
        }

        if(quantity > 0){
            this.ticketsValid = true;
        }
        else{
            this.ticketsValid = false;
        }
    }

}
