import 'rxjs/add/operator/do';
import 'rxjs/add/operator/pluck';

import { Component, AfterContentInit } from '@angular/core';
import { Router, NavigationEnd, RoutesRecognized } from '@angular/router';
import { AuthService } from '../../auth/services/auth-service';
import { ManageRegistrationsService } from './manage-registrations.service';

@Component({
    templateUrl: './promoted.html',
    styles: [
        `
            .nav-tabs .nav-item {
                margin-bottom: -1px;
                min-width: 120px;
                text-align: center;
            }

            .light-bottom-border{
                border-bottom: 1px solid #eaeaea;
            }
        `
    ]
})

export class RegistrationsComponent {

    constructor(private auth: AuthService, private router: Router, public promotionsService: ManageRegistrationsService) {

    }

}
