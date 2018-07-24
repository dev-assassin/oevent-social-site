import 'rxjs/add/operator/do';
import 'rxjs/add/operator/pluck';

import {Component, AfterContentInit} from '@angular/core';
import {Router, NavigationEnd, RoutesRecognized} from '@angular/router';
import {AuthService} from "../../auth/services/auth-service";
import {ManageService} from "../../shared-module/services/manage-service";
import * as _ from "lodash";

@Component({
    templateUrl: './organized.html',
    styles: [
        `
           
           .event-category.two-liner .c-content-overlay .c-overlay-object h3:last-child{
                font-size:4.5rem;
           }
           
           .event-category.two-liner .c-content-overlay .c-overlay-object h3:first-child{
                padding-top: 5px;
                padding-bottom: 10px;
           }           
           
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

export class OrganizedComponent{

    events$:any;
    set:boolean = false;
    counts:any = {
        active: 0,
        draft: 0,
        closed: 0,
        cancelled: 0,
        completed: 0
    };

    constructor(private auth: AuthService, private router: Router, public manageService: ManageService) {
        this.events$ = this.manageService.getEvents('');
        this.events$.subscribe((events)=>{
            this.setCounts(events);
            this.set = true;
        })
    }

    setCounts(events){

        let $this = this;

        let split = _.groupBy(events, 'status');

        Object.keys(split).forEach(function(key,index) {
            $this.counts[key] = split[key].length;
        });

    }

}
