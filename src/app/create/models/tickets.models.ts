export interface ITicket{
    $key?: string;
    $exists?();
    open?:boolean;
    ticketType: string;
    ticketTitle: string;
    ticketDescription: string;
    ticketQuantity: number;
    ticketPrice?: number;
    buyMultiple?: boolean;
    refundable?: boolean;
    maxPer: number;
    payPal?: string;
    ticketsUsed:number;
    ticketsLeft:number;
    multiRegistrant:boolean;
}

export class Ticket implements ITicket{
    open:boolean = false;
    ticketType: string = "free";
    ticketTitle: string = "";
    ticketDescription: string = "";
    ticketPrice: number = 0;
    buyMultiple: boolean = false;
    maxPer: number = 1;
    multiRegistrant: boolean = false;
    refundable:boolean = true;
    payPal: string = "";
    ticketQuantity: number = 0;
    ticketsUsed:number = 0;
    ticketsLeft:number = 0;
    eventRef:string;

    //make sure and get event ref
    constructor(eventRef){
        this.eventRef = eventRef;
    }
}

export interface IDraftTickets{
    $key?:string;
    tickets: ITicket[];
}

export class DraftTickets implements IDraftTickets{
    tickets: ITicket[];
    constructor(tickets:ITicket[] = []){
        this.tickets = tickets;
    }
}