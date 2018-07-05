import 'rxjs/add/operator/do';
import 'rxjs/add/operator/pluck';

import { Component, AfterContentInit, OnInit } from '@angular/core';
import { Router, NavigationEnd, RoutesRecognized, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../../auth/services/auth-service';
import { AppService } from '../../services/app-service';
import { FollowingService } from '../services/following.service';

@Component({
    templateUrl: './my-followers.component.html',
    styles: [
        ``
    ],

})

export class MyFollowersComponent implements OnInit {

    followers: string[];

    constructor(private auth: AuthService, private appService: AppService,
        private router: Router, private route: ActivatedRoute, private followingService: FollowingService) {

    }

    ngOnInit() {

        // POPULATE ONLY AFTER AUTH
        if (this.appService.authChecked) {
            this.populateFollowers();
        } else {
            this.auth.authObservable.first().subscribe((data) => {
                this.populateFollowers();
            });
        }



    }

    populateFollowers() {
        this.followingService.getMyFollowers().first().subscribe((data) => {

            console.log(data);

            this.followers = [];

            for (const person of data) {
                this.followers.push(person.$key);
            }
        });
    }

}
