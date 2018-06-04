import {IInvoice} from "./invoice";

export interface IPayment {
    id:number;
    status:string;
    paid:boolean;
    invoice:IInvoice;
    invoiceKey:string;
}

export class Payment implements IPayment {
    id:number;
    status:string;
    paid:boolean;

    //IN TRUE NOSQL FASHION WE DUPLICATE THIS FOR FASTER READS
    invoice:IInvoice;

    invoiceKey:string;

}