import 'rxjs/add/operator/do';
import 'rxjs/add/operator/pluck';

import { Component, AfterContentInit, Input, OnInit } from '@angular/core';
import { Router, NavigationEnd, RoutesRecognized } from '@angular/router';
import { AuthService } from '../../../auth/services/auth-service';
import { IoEvent } from '../../../shared-models/oevent';

@Component({
    templateUrl: './detail.html',
    selector: 'app-manage-detail',
    styles: [
        `
           .edit{
                font-size: 10px;
                color: #1c8a98;
                position: relative;
                top: -2px;
                left: 5px;
           }
           .edit:hover{
                color:#26C6DA;
           }
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

export class OrganizedDetailComponent implements OnInit {

    @Input() event: IoEvent;
    @Input() live: boolean;

    constructor(private auth: AuthService, private router: Router) {

    }

    ngOnInit() {
        console.log(this.event);
    }
}
