import 'rxjs/add/operator/do';
import 'rxjs/add/operator/pluck';

import { Component, AfterContentInit } from '@angular/core';
import { Router, NavigationEnd, RoutesRecognized } from '@angular/router';
import { AuthService } from '../../../auth/services/auth-service';
import { ManageService } from '../../../shared-module/services/manage-service';
import { AngularFireDatabase } from 'angularfire2/database';
import { IoEvent } from '../../../shared-models/oevent';
// import { FirebaseListObservable } from 'angularfire2/database/firebase_list_observable';

@Component({
    templateUrl: './live.html',
    styles: [
        `
           .c-cart-table-row{
            border-bottom: 1px solid;
            border-color: rgba(135,151,174,.15);
            padding:15px 0;
           }

           @media(min-width: 776px){
                .c-cart-sub-title{
                    display:none;
                }
            }
    `
    ]
})

export class OrganizedLiveComponent {

    events: IoEvent[] = [];
    activeEvents$: any;
    // activeEvents$: FirebaseListObservable<any[]>;

    constructor(private auth: AuthService, private router: Router, public manageService: ManageService, private af: AngularFireDatabase) {
        this.activeEvents$ = this.manageService.getEvents('active');
    }

}
