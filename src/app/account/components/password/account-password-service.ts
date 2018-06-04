import { Injectable } from '@angular/core';
import {AccountService} from "../../services/account-service";


@Injectable()
export class AccountPasswordService {

    constructor(private accountService: AccountService) {

    }

}
