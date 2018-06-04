import { Component } from '@angular/core';
import {AuthService} from "../../../auth/services/auth-service";
import {AccountSubscriptionService} from "./account-subscription-service";

@Component({
    selector: 'account-subscription-memebership',
    styles: [

    ],
    template: `
        
       
            
                <div class="tab-pane active" id="tab_1_1_content">
                    <div class="row">
                        <div class="col-md-4">
                            <div class="panel panel-default c-panel" style="min-height:230px">
                                <div class="panel-body c-panel-body">
                                    <div class="row c-padding-20  text-center">
                                        <h1 class="c-font-uppercase c-font-bold">Standard</h1>
                                        <h2 class="c-theme-font c-font-uppercase c-font-bold">$9.95 / mo.</h2>
                                        <p class="c-font-uppercase c-font-bold">1000 Copies</p>
                                        <p class="c-font-uppercase c-font-bold">Unlimited Data</p>
                                        <p class="c-font-uppercase c-font-bold">Unlimited Users</p>
                                        <p class="c-font-uppercase c-font-bold">For 7 days</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div class="col-md-8">
                            <p> <small>*This shows the membership level that you are at for the current billing cycle. Note that if you downgrade your membership level, you will still retain your higher membership level until the next billing cycle, in which the downgrade process will be complete. If you have downgraded your membership level, you can verify that the change was successfully made by looking at the "Next Bill" tab. </small></p>
                            <br>
                            <a routerLink="/membership" class="btn btn-lg btn-primary">Modify Membership</a>
                        </div>
                    </div>
                    <div class="row text-center">

                    </div>
                </div>
                

                
    `
})

export class AccountSubscriptionMembershipComponent {

    constructor(private auth: AuthService, private subscriptionService: AccountSubscriptionService){

    }

}
