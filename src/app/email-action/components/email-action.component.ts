import 'rxjs/add/operator/do';
import 'rxjs/add/operator/pluck';

import {Component, AfterContentInit, OnInit} from '@angular/core';
import {Router, NavigationEnd, RoutesRecognized, ActivatedRoute, Params} from '@angular/router';
import {AuthService} from "../../auth/services/auth-service";
import {AppService} from "../../services/app-service";


@Component({
    templateUrl: './email-action.component.html',
    styles: [
        `
           a.selected{
                color:#014c8c;
           } 
        `
    ],

})

export class EmailActionComponent implements OnInit{

    view = '';

    constructor(private auth: AuthService,
                private appService: AppService,
                private router: Router,
                private route: ActivatedRoute) {

    }

    ngOnInit(){
        this.route.queryParams.subscribe((params:Params)=>{
            this.view = params['mode'];
            console.log(params);
        })
    }



}
