import 'rxjs/add/operator/do';
import 'rxjs/add/operator/pluck';

import { Component, AfterContentInit, OnInit } from '@angular/core';
import { Router, NavigationEnd, RoutesRecognized, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../../auth/services/auth-service';
import { AppService } from '../../services/app-service';
import { FollowingService } from '../services/following.service';

@Component({
    templateUrl: './follows.component.html',
    styles: [
        ``
    ],

})

export class FollowingComponent implements OnInit {

    follows: string[];

    constructor(private auth: AuthService, private appService: AppService,
        private router: Router, private route: ActivatedRoute, private followingService: FollowingService) {
    }

    ngOnInit() {

        // POPULATE ONLY AFTER AUTH
        if (this.appService.authChecked) {
            this.populateFollows();
        } else {
            this.auth.authObservable.first().subscribe((data) => {
                this.populateFollows();
            });
        }

    }

    populateFollows() {
        this.followingService.getMyFollows().first().subscribe((data) => {

            this.follows = [];

            for (const person of data) {
                this.follows.push(person.$key);
            }
        });
    }

}
