import 'rxjs/add/operator/do';
import 'rxjs/add/operator/pluck';

import { Component, AfterContentInit } from '@angular/core';
import { Router, NavigationEnd, RoutesRecognized } from '@angular/router';
import { AuthService } from '../../../auth/services/auth-service';
import { ManagePromotionsService } from '../../../shared-module/services/manage-promotions.service';

@Component({
    template: `
        <div class="row">
            <div
                manage-card
                class="col-sm-6"
                *ngFor="let event of promotionsService.myPromotions$ | async"
                [eventId]="event.$key"
                [eventType]="'promotedLive'">
            </div>
        </div>
    `,
    styles: [

    ]
})

export class PromotedLiveComponent {

    constructor(private auth: AuthService,
        private router: Router,
        public promotionsService: ManagePromotionsService) {

    }

}
