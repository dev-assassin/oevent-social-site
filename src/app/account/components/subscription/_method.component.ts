import { Component } from '@angular/core';
import {AuthService} from "../../../auth/services/auth-service";
import {AccountSubscriptionService} from "./account-subscription-service";

@Component({
    selector: 'account-subscription-method',
    styles: [

    ],
    template: `
        
        
        <div class="tab-pane" id="tab_1_2_content">
            <div class="row">
                <div class="col-md-4">
                    <div class="panel panel-default c-panel" style="min-height:230px">
                        <div class="panel-body c-panel-body">
                            <div class="row c-padding-20 text-center">
                                <h1 class="c-font-uppercase c-font-bold">Payment Method</h1>
                                <i class="fa fa-credit-card fa-2x c-theme-font c-margin-t-10 c-margin-b-10"></i>
                                <p class="c-font-uppercase c-font-bold">XXXX-XXXX-XXXX-5465</p>

                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-8">
                    <p> <small>*This is the credit card information that will be used for your monthly subscription payment. You can change this at anytime.</small></p>
                    <br>
                    <a href="membership-modify.aspx" class="c-action-btn btn btn-lg c-theme-btn c-btn-bold c-btn-uppercase">Modify Payment</a>
                </div>
            </div>
        </div>
                

                
    `
})

export class AccountSubscriptionMethodComponent {

    constructor(private auth: AuthService, private subscriptionService: AccountSubscriptionService){

    }

}
