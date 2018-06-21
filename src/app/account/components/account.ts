import 'rxjs/add/operator/do';
import 'rxjs/add/operator/pluck';

import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from '../services/account-service';

@Component({
    templateUrl: './account.html'
})

export class AccountComponent implements OnDestroy {
    constructor(public route: ActivatedRoute, public accountService: AccountService) {
    }

    ngOnDestroy() {
        this.accountService.onDestroy();
    }
}
