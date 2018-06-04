export interface IAccountContact{
    $key?: string;
    first: string;
    last: string;
    gender: number;
    email: string;
    phone: string;
    country: string;
    address: string;
    address2: string;
    city: string;
    state: string;
    postal: string;
    bMonth: number;
    bDay: number;
    bYear: number;
    timeZone: number;
}

export class AccountContact implements IAccountContact{
    first: string = "";
    last: string = "";
    gender: number = 0;
    email: string = "";
    phone: string = "";
    country: string = "";
    address: string = "";
    address2: string = "";
    city: string = "";
    state: string = "";
    postal: string = "";
    bMonth: number = 0;
    bDay: number = 0;
    bYear: number = 0;
    timeZone: number = 0;

    constructor() {

    }

}