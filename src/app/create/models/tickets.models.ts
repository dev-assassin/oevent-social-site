export interface ITicket {
    $key?: string;
    $exists?();
    // tslint:disable-next-line:member-ordering
    open?: boolean;
    // tslint:disable-next-line:member-ordering
    ticketType: string;
    // tslint:disable-next-line:member-ordering
    ticketTitle: string;
    // tslint:disable-next-line:member-ordering
    ticketDescription: string;
    // tslint:disable-next-line:member-ordering
    ticketQuantity: number;
    // tslint:disable-next-line:member-ordering
    ticketPrice?: number;
    // tslint:disable-next-line:member-ordering
    buyMultiple?: boolean;
    // tslint:disable-next-line:member-ordering
    refundable?: boolean;
    // tslint:disable-next-line:member-ordering
    maxPer: number;
    // tslint:disable-next-line:member-ordering
    payPal?: string;
    // tslint:disable-next-line:member-ordering
    ticketsUsed: number;
    // tslint:disable-next-line:member-ordering
    ticketsLeft: number;
    // tslint:disable-next-line:member-ordering
    multiRegistrant: boolean;
}

export class Ticket implements ITicket {
    open = false;
    ticketType = 'free';
    ticketTitle = '';
    ticketDescription = '';
    ticketPrice = 0;
    buyMultiple = false;
    maxPer = 1;
    multiRegistrant = false;
    refundable = true;
    payPal = '';
    ticketQuantity = 0;
    ticketsUsed = 0;
    ticketsLeft = 0;
    eventRef;

    // make sure and get event ref
    constructor(eventRef) {
        this.eventRef = eventRef;
    }
}

export interface IDraftTickets {
    $key?: string;
    tickets: ITicket[];
}

export class DraftTickets implements IDraftTickets {
    tickets: ITicket[];
    constructor(tickets: ITicket[] = []) {
        this.tickets = tickets;
    }
}
