export interface ITicketRegistration {
    fields: any[];
    ticketName: string;
    ticketRef: string;
    ticketNumber: number;
    eventRef: string;
    ocode: string;
    requiresPayment: boolean;
    paid: boolean;
    showMulti: boolean;
    buyMultiple: boolean;
    multiChild: boolean;
    multiParent: boolean;
    regQty: number;
    catQty: number;
    val?();
    exists?();
    // tslint:disable-next-line:member-ordering
    createdAt?;
}

export class TicketRegistration implements ITicketRegistration {
    fields: any[];
    ticketNumber: number;
    ticketName = '';
    ticketRef = '';
    eventRef = '';
    ocode = '';
    requiresPayment: boolean;
    paid = false;
    showMulti = false;
    buyMultiple = false;
    multiChild = false;
    multiParent = false;
    regQty = 1;
    catQty = 1;
    set = false;

    constructor() {

    }

}
