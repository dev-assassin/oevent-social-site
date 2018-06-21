export interface IAccountContact {
    $key?: string;
    first: string;
    last: string;
    gender;
    email: string;
    phone: string;
    country: string;
    address: string;
    address2: string;
    city: string;
    state: string;
    postal: string;
    bMonth;
    bDay;
    bYear;
    timeZone;
}

export class AccountContact implements IAccountContact {
    first = '';
    last = '';
    gender = 0;
    email = '';
    phone = '';
    country = '';
    address = '';
    address2 = '';
    city = '';
    state = '';
    postal = '';
    bMonth = 0;
    bDay = 0;
    bYear = 0;
    timeZone = 0;

    constructor() {

    }

}
