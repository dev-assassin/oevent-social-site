import 'rxjs/add/operator/do';
import 'rxjs/add/operator/pluck';

import {Component, AfterContentInit} from '@angular/core';
import {Router, NavigationEnd, RoutesRecognized} from '@angular/router';
import {AuthService} from "../../../auth/services/auth-service";
import {ManageRegistrationsService} from "../manage-registrations.service";

@Component({
    templateUrl: './history.html',
    styles: [

    ]
})

export class RegistrationsHistoryComponent{

    constructor(private auth: AuthService,
                private router: Router,
                public promotionsService: ManageRegistrationsService) {

    }

}
