import { Component } from '@angular/core';
import { AuthService } from '../../../auth/services/auth-service';
import { AccountSubscriptionService } from './account-subscription-service';

@Component({
    selector: 'app-account-subscription',
    styles: [

    ],
    template: `
        <h3 class="line">
            Manage Subscription (TODO)
        </h3>

        <div class="c-content-tab-1 c-theme c-margin-t-30">
            <div class="clearfix">
                <ul class="nav nav-inline nav-tabs c-font-uppercase c-font-bold">
                    <li class="nav-item" routerLink="membership" routerLinkActive="active">
                        <a class="nav-link">Membership</a>
                    </li>
                    <li class="nav-item" routerLink="method" routerLinkActive="active">
                        <a class="nav-link">Payment Method</a>
                    </li>
                    <li class="nav-item" routerLink="invoices" routerLinkActive="active">
                        <a class="nav-link">Next Invoice</a>
                    </li>
                </ul>
            </div>
            <div class="tab-content c-bordered c-padding-lg">
                <router-outlet></router-outlet>
            </div>
        </div>
    `
})

export class AccountSubscriptionComponent {

    constructor(private auth: AuthService, private subscriptionService: AccountSubscriptionService) {

    }

}
