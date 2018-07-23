import 'rxjs/add/operator/do';
import 'rxjs/add/operator/pluck';

import { Component, AfterContentInit } from '@angular/core';
import { Router, NavigationEnd, RoutesRecognized } from '@angular/router';
import { AuthService } from '../../../auth/services/auth-service';
import { ManageService } from '../../../shared-module/services/manage-service';

@Component({
    templateUrl: './drafts.html',
    styles: [
        ``
    ]
})

export class OrganizedDraftComponent {

    events$;

    constructor(private auth: AuthService, private router: Router, public manageService: ManageService) {
        this.events$ = this.manageService.getEvents('draft');
    }

}
