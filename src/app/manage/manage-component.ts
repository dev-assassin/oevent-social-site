import 'rxjs/add/operator/do';
import 'rxjs/add/operator/pluck';

import { Component, AfterContentInit } from '@angular/core';
import { Router, NavigationEnd, RoutesRecognized } from '@angular/router';
import { AuthService } from '../auth/services/auth-service';

@Component({
    templateUrl: './manage.html',
    styleUrls: [
        './manage.scss'
    ]
})

export class ManageComponent {

    constructor(private auth: AuthService, private router: Router) {

    }

    gotoOrganized() {
        this.router.navigateByUrl('manage/organized/live');
    }

    gotoPromoted() {
        this.router.navigateByUrl('manage/promoted/live');
    }

    gotoTickets() {
        this.router.navigateByUrl('manage/attending/upcoming');
    }

}
