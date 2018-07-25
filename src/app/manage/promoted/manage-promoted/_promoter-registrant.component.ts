import 'rxjs/add/operator/do';
import 'rxjs/add/operator/pluck';

import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../auth/services/auth-service';
// import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database'
import { IAccountAbout, AccountAbout } from '../../../account/components/about/about-model';
import * as moment from 'moment';
import { EmailService } from '../../../shared-module/services/email.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmailPopupComponent } from '../../../shared-module/components/email/email-popup.component';
import { AngularFireDatabase } from '../../../../../node_modules/angularfire2/database';


@Component({
    selector: 'app-promoter-registrant',
    template: `


        <div class="row" *ngIf="set">

            <table>
                <tr>
                    <td style="width:29%;vertical-align: middle">
                        <img [src]="imageURL" class="img-fluid">
                    </td>
                    <td style="padding-left:3%;vertical-align: middle">
                        <div style="">
                            <strong>{{ registrantName }}</strong>
                        </div>

                        <div>
                            Registered <strong><-DATE-></strong>
                        </div>
                        <div>
                            {{ registrantInfo.ticketTitle }}
                            <span *ngIf="registrantInfo.ticketQty > 1">({{ registrantInfo.ticketQty }})</span>
                        </div>
                        <div>
                            <a (click)="emailRegistrant()">
                                <i class="fa fa-envelope"></i>
                                Email
                            </a>
                        </div>
                    </td>
                </tr>
            </table>
        </div>

    `,
    styles: [
        `
            :host{padding-top:1.5rem;}
        `
    ]

})

// tslint:disable-next-line:component-class-suffix
export class PromoterRegistrant implements OnInit {

    @Input() registrantInfo: any;
    registrantName = '';
    set = false;
    imageURL: string;

    constructor(private af: AngularFireDatabase,
        public emailService: EmailService,
        private modalService: NgbModal,
        public activeModal: NgbActiveModal, ) {

    }

    ngOnInit() {
        this.registrantName = this.registrantInfo.firstName + '' + this.registrantInfo.lastName;
        this.af.object(`about/${this.registrantInfo.uid}/imageURL`).first().subscribe((data) => {
            this.imageURL = data.$value;
            this.set = true;
        });
        console.log(this.registrantInfo);
    }

    emailRegistrant() {
        this.emailService.setToEmail(this.registrantName, this.registrantInfo.email);
        this.activeModal.dismiss();
        const signInRef = this.modalService.open(EmailPopupComponent);
        signInRef.componentInstance.name = 'Attend';
    }

}
