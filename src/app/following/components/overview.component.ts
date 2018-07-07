import 'rxjs/add/operator/do';
import 'rxjs/add/operator/pluck';

import { Component, AfterContentInit, OnInit } from '@angular/core';
import { Router, NavigationEnd, RoutesRecognized, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../../auth/services/auth-service';
import { AppService } from '../../services/app-service';
import { FollowingService } from '../services/following.service';

@Component({
    templateUrl: './overview.component.html',
    styles: [
        `
             .event-category.two-liner .c-content-overlay .c-overlay-object h3:last-child{
                font-size:5rem;
             }
        `
    ],

})

export class FollowingOverviewComponent implements OnInit {

    followsSet = false;
    follows: string[] = [];
    followersSet = false;
    followers: string[] = [];

    constructor(private auth: AuthService, private appService: AppService, private router: Router,
        private route: ActivatedRoute, private followingService: FollowingService) {

    }

    ngOnInit() {

        // POPULATE ONLY AFTER AUTH
        if (this.appService.authChecked) {
            this.populate();
        } else {
            this.auth.authObservable.first().subscribe((data) => {
                this.populate();
            });
        }
    }

    populate() {

        this.followingService.getMyFollowers().first().subscribe((data) => {
            this.followers = data;
            this.followersSet = true;
        });
        this.followingService.getMyFollows().first().subscribe((data) => {
            this.follows = data;
            this.followsSet = true;
        });


    }

}
