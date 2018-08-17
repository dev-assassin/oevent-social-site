import 'rxjs/add/operator/do';
import 'rxjs/add/operator/pluck';

import { Component, OnInit } from '@angular/core';
import { AppService } from '../../services/app-service';
import { ToastyService } from 'ng2-toasty';
import { AuthService } from '../../auth/services/auth-service';
import { MembershipService } from '../services/membership.service';

@Component({
    templateUrl: './membership-options.component.html',
    styles: [
        `
            .curr-level{margin-top:13px;}
        `
    ]
})

export class MembershipOptionsComponent implements OnInit {

    set = false;
    membership: string;

    constructor(private appService: AppService, private toasty: ToastyService,
        private auth: AuthService, private membershipService: MembershipService) {
        this.appService.startLoadingBar();
    }

    ngOnInit() {
        this.membershipService.getMembership().then((data) => {



            if (data.$exists()) {
                this.membership = data.membershipType;
                this.set = true;
                this.appService.stopLoadingBar();
            } else {

                this.membershipService.setMembership('free').then(() => {
                    this.membership = 'free';
                    this.appService.stopLoadingBar();
                    this.set = true;
                });
            }

        });
    }

    updateMembership(membership: string) {
        this.appService.startLoadingBar();
        this.membershipService.setMembership(membership).then(() => {
            this.appService.stopLoadingBar();
            this.membership = membership;
            this.toasty.success(`Membership updated to ${membership}`);
        });
    }

}
