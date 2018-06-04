import { Injectable } from '@angular/core';
import {AccountService} from "../../services/account-service";


@Injectable()
export class AccountPaymentService {

    constructor(private accountService: AccountService) {

    }

}
