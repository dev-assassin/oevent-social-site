import { Component } from '@angular/core';
import {AuthService} from "../../../auth/services/auth-service";
import {AccountSubscriptionService} from "./account-subscription-service";

@Component({
    selector: 'account-subscription-invoices',
    styles: [

    ],
    template: `
        
                <div class="tab-pane" id="tab_1_3_content">
                    <div class="row">

                        <div class="col-md-12">
                            <p class="c-margin-b-25"> Here is information for your next monthly subscription payment.</p>
                            <div class="panel panel-default c-panel">
                                <div class="panel-body c-panel-body">

                                    <div class="row">
                                        <div class="col-sm-6">
                                            <h1>Next Billing Date: 1/31/2016</h1>
                                        </div>
                                        <div class="col-sm-6 text-right">
                                            <h1></h1>
                                            <h1><small></small></h1>
                                        </div>
                                    </div>

                                    <!-- / end client details section -->
                                    <table class="table table-bordered">
                                        <thead>
                                        <tr>
                                            <th>
                                                <h4>Service</h4>
                                            </th>
                                            <th>
                                                <h4>Description</h4>
                                            </th>
                                            <th>
                                                <h4 class="pull-right">Rate/Price</h4>
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                            <td>Membership</td>
                                            <td><a href="#">Standard Membership Level</a></td>
                                            <td class="text-right">$9.95</td>
                                        </tr>
                                        <tr>
                                            <td>Add Ons</td>
                                            <td><a href="#">Add On 1</a></td>
                                            <td class="text-right">$1.00</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                    <div class="row text-right">
                                        <div class="col-sm-9">
                                            <p>
                                                <strong>
                                                    Sub Total :
                                                </strong>
                                            </p>
                                        </div>
                                        <div class="col-sm-3">
                                            <strong>
                                                $1200.00
                                            </strong>
                                        </div>
                                    </div>
                                    <div class="row text-right">
                                        <div class="col-sm-9">
                                            <p>
                                                <strong>
                                                    TAX :
                                                </strong>
                                            </p>
                                        </div>
                                        <div class="col-sm-3">
                                            <strong>
                                                N/A
                                            </strong>
                                        </div>
                                    </div>
                                    <div class="row text-right">
                                        <div class="col-sm-9">
                                            <p>
                                                <strong>
                                                    Total :
                                                </strong>
                                            </p>
                                        </div>
                                        <div class="col-sm-3">
                                            <strong>
                                                $1200.00
                                            </strong>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                
    `
})

export class AccountSubscriptionInvoicesComponent {

    constructor(private auth: AuthService, private subscriptionService: AccountSubscriptionService){

    }

}
