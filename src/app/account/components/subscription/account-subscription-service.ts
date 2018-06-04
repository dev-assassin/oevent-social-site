import { Injectable } from '@angular/core';
import {AccountService} from "../../services/account-service";


@Injectable()
export class AccountSubscriptionService {

    constructor(private accountService: AccountService) {

    }

}
