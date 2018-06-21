import { Injectable } from '@angular/core';
import { AccountService } from '../../services/account-service';


@Injectable()
export class AccountSocialService {

    constructor(private accountService: AccountService) {

    }

}
