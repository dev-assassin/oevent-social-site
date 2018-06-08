import {Component, AfterContentInit, OnInit} from '@angular/core';
import {Router, NavigationEnd, RoutesRecognized, ActivatedRoute, Params} from '@angular/router';
import {AppService} from "../../../services/app-service";
import {AuthService} from "../../../auth/services/auth-service";
import {CreateAdvancedService} from "./services/advanced.service";

@Component({
    templateUrl: './advanced.component.html',
    styles: [
        `
            
        `
    ],

})

export class AdvancedComponent implements OnInit{

    constructor(private auth: AuthService,
                private appService: AppService,
                private router: Router,
                private route: ActivatedRoute,
                private advancedService:CreateAdvancedService) {

    }

    ngOnInit(){

    }


}
