/* tslint:disable:no-string-literal */

interface IItem{
    sku?:string;
    name:string;
    price:number;
}

export interface IInvoice {
    id:number;
    date:string;
    items:IItem[];
    subTotal:number;
    taxes:number;
    total:number;
    paymentStatus:string;
    paid:boolean;
}

export class Invoice implements IInvoice {
    id:number;
    date:string;
    items:IItem[];
    subTotal:number;
    taxes:number;
    total:number;
    paymentStatus:string;
    paid:boolean;
}