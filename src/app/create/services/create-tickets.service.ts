import {Injectable, OnDestroy} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import {ITicket, Ticket} from "../models/tickets.models";
import {CreateEventService} from "./create-event.service";
import {AuthService} from "../../auth/services/auth-service";

@Injectable()
export class CreateTicketsService{

    ticketList$:FirebaseListObservable<ITicket[]>;
    ticketListObject$:FirebaseObjectObservable<any>;
    eventId:string;

    constructor(private af: AngularFireDatabase,
                private auth: AuthService
                ) {

    }

    getTicketObject(key):FirebaseObjectObservable<ITicket>{
        let ticketObject$:FirebaseObjectObservable<ITicket> = this.af.object(`drafts/tickets/${this.eventId}/${key}`);
        return ticketObject$;
    }

    initTickets(eventId){
        this.ticketList$ = this.af.list(`drafts/tickets/${eventId}`);
        this.eventId = eventId;
        this.ticketListObject$ = this.af.object(`drafts/tickets/${eventId}`, {preserveSnapshot: true});
    }

    addTicket(ticketType){
        let ticket:ITicket = new Ticket(this.eventId);
        ticket.ticketType = ticketType;
        this.ticketList$.push(ticket);
    }

    removeTicket(key){
        console.log('remove in service');
        this.ticketList$.remove(key);
    }

}
