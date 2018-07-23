import 'rxjs/add/operator/do';
import 'rxjs/add/operator/pluck';

import {Component, AfterContentInit} from '@angular/core';
import {Router, NavigationEnd, RoutesRecognized} from '@angular/router';
import {AuthService} from "../../../auth/services/auth-service";
import {ManageService} from "../../../shared-module/services/manage-service";
import {AngularFireDatabase} from "angularfire2/database"
import {IoEvent} from "../../../shared-models/oevent";

@Component({
    templateUrl: './history.html',
    styles: [
        `
            
           
           .c-cart-table-row{
            border-bottom: 1px solid;
            border-color: rgba(135,151,174,.15);
            padding:15px 0;
           }
           
           @media(min-width: 776px){
                .c-cart-sub-title{
                    display:none;
                }     
            }
    `
    ]
})

export class OrganizedHistoryComponent{

    events:IoEvent[] = [];

    constructor(private auth: AuthService, private router: Router, public manageService: ManageService, private af:AngularFireDatabase) {
        let actives$ = this.manageService.getEvents('active');
        this.loopActiveEvents(actives$);
    }

    loopActiveEvents(actives$){
        actives$.first().subscribe((data)=>{
            console.log(data);
            for(let event of data){
                this.addLiveEvent(event.$key);
            }
        });
    }

    addLiveEvent(key){
        this.af.object(`/events/live/${key}/data`).first().subscribe((data)=>{
            data.$key = key;
            this.events.push(data);
        });
    }

}
