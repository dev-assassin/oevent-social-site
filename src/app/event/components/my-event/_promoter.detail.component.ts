import 'rxjs/add/operator/do';
import 'rxjs/add/operator/pluck';

import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../auth/services/auth-service';
import { EventService } from '../../services/event-service';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { IAccountAbout, AccountAbout } from '../../../account/components/about/about-model';
import * as moment from 'moment';
import { EmailService } from '../../../shared-module/services/email.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmailPopupComponent } from '../../../shared-module/components/email/email-popup.component';


@Component({
    selector: 'app-promoter-details',
    template: `
        <div class="row">
            <div class="col-lg-6">
                <img [src]="profile.imageURL" *ngIf="profile.imageSet" class="img-fluid">
            </div>
            <div class="col-lg-6">
                <div style="padding-bottom:.5rem">
                    <a routerLink="/{{ocode}}">
                        <strong>{{ profile.organizerName }}</strong>
                    </a>
                </div>
                <div>
                    ōcode: <strong>{{ ocode }}</strong>
                </div>
                <div>
                    Promoter since: {{ displayDate}}
                </div>
                <div>
                    <strong>{{ tickets }}</strong> registrations
                </div>
                <div>
                    <a routerLink="/{{ocode}}">
                        <i class="fa fa-user"></i>
                        View profile
                    </a>
                </div>
                <div>
                    <a (click)="emailPromoter()">
                        <i class="fa fa-envelope"></i>
                        Email
                    </a>
                </div>
            </div>
        </div>
    `,
    styles: [
        `
            :host{padding-top:1.5rem;}
        `
    ]

})

export class PromoterDetail implements OnInit {

    @Input() ocode: string;
    @Input() eventId: string;
    @Input() registrations: any;
    @Input() datetime: any;
    registrations$: any[] = [];
    set = false;
    profile: IAccountAbout = new AccountAbout();
    quantity = 0;
    tickets = 0;
    displayDate: any;
    promoterEmail: string;
    promoterName: string;

    constructor(private af: AngularFireDatabase,
        public emailService: EmailService,
        private modalService: NgbModal,
        public activeModal: NgbActiveModal, ) {

    }

    ngOnInit() {

        const $this = this;

        this.displayDate = moment(this.datetime).format('MM/DD/YY');

        if (typeof this.registrations !== 'undefined') {
            this.quantity = Object.keys(this.registrations).length;

            Object.keys(this.registrations).forEach(function (key, index) {

                console.log(key, $this.eventId);

                $this.af.object(`/registrations/events/${$this.eventId}/${key}`).first().subscribe((snap) => {

                    console.log(snap);

                    $this.registrations$.push(snap);

                    if (typeof snap.children !== 'undefined') {
                        $this.tickets = $this.tickets + snap.children.length;

                        for (const ticketRef of snap.children) {
                            $this.tickets++;
                        }

                    }

                    $this.set = true;


                });
            });

        }

        this.populatePromoter();
        this.populateRegistrations();

    }

    populatePromoter() {
        this.af.object(`/ocodes/${this.ocode}`).first().subscribe((snap) => {

            this.af.object(`/about/${snap.uid}`).subscribe((snap) => {
                this.profile = snap;
                this.set = true;
            });

            this.af.object(`/contact/${snap.uid}`).subscribe((snap) => {
                this.promoterEmail = snap.email;
                this.promoterName = snap.first + '' + snap.last;
            });

        });
    }

    populateRegistrations() {

    }

    emailPromoter() {
        this.emailService.setToEmail(this.promoterEmail, this.promoterName);
        this.activeModal.dismiss();
        const signInRef = this.modalService.open(EmailPopupComponent);
        signInRef.componentInstance.name = 'Attend';
    }

}
