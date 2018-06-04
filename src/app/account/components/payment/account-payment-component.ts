import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../auth/services/auth-service";
import {AccountPaymentService} from "./account-payment-service";

@Component({
    selector: 'account-payment',
    styles: [

    ],
    template: `
        
        <h3 class="line">
            Payment History (TODO)
        </h3>

        <div class="row">
            <div class="col-md-12">
                <table class="table table-hover">
                    <thead>
                    <tr>
                        <th>Invoice#</th>
                        <th>Payment Date</th>
                        <th>Amount Paid</th>
                        <th>Card Used</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>
                            <a href="javascript:;" data-toggle="modal" data-target="#invoice-modal" class="c-link "><u>2283</u></a>
                        </td>
                        <td>3/23/2017</td>
                        <td>$10.71</td>
                        <td>VISA ending in 2832</td>
                    </tr>
                    <tr>
                        <td>
                            <a href="javascript:;" data-toggle="modal" data-target="#invoice-modal" class="c-link "><u>2200</u></a>
                        </td>
                        <td>3/23/2017</td>
                        <td>$10.71</td>
                        <td>VISA ending in 2832</td>
                    </tr>
                    <tr>
                        <td>
                            <a href="javascript:;" data-toggle="modal" data-target="#invoice-modal" class="c-link "><u>2170</u></a>
                        </td>
                        <td>3/23/2017</td>
                        <td>$10.71</td>
                        <td>VISA ending in 2832</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="row">
            <div class="col-md-12">
                <p><small><i>*To view more detail about a particular payment, click the invoice number</i></small></p>
            </div>
        </div>

    `
})

export class AccountPaymentComponent implements OnInit{

    constructor(private auth: AuthService, private paymentService: AccountPaymentService){

    }

    ngOnInit(){
        console.log(this.auth.id);
    }

}
