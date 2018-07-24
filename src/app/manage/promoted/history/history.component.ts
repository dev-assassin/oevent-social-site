import 'rxjs/add/operator/do';
import 'rxjs/add/operator/pluck';

import { Component, OnInit, AfterContentInit } from '@angular/core';
import { Router, NavigationEnd, RoutesRecognized } from '@angular/router';
import { AuthService } from '../../../auth/services/auth-service';
import { ManagePromotionsService } from '../../../shared-module/services/manage-promotions.service';

@Component({
    templateUrl: './history.html',
    styles: [

    ]
})

export class PromotedHistoryComponent implements OnInit {
    promotions: any[];
    constructor(private auth: AuthService, private router: Router, public promotionsService: ManagePromotionsService) {
        this.promotions = [];
    }

    ngOnInit(): void {
        this.loadPromotions();
    }

    loadPromotions(): void {
        this.promotionsService.myPromotions$
            .subscribe(snapshots => {
                this.promotions = snapshots;
            });
    }


}
