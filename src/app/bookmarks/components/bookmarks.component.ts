import 'rxjs/add/operator/do';
import 'rxjs/add/operator/pluck';

import {Component, AfterContentInit, OnInit} from '@angular/core';
import {Router, NavigationEnd, RoutesRecognized, ActivatedRoute, Params} from '@angular/router';
import {AuthService} from "../../auth/services/auth-service";
import {AppService} from "../../services/app-service";
import {BookmarkService} from "../../shared-module/services/bookmark.service";

@Component({
    templateUrl: './bookmarks.component.html',
    styles: [
        `
           a.selected{
                color:#014c8c;
           } 
        `
    ],

})

export class BookmarkComponent implements OnInit{

    verticalCard:boolean = false;
    events:any[] = [];

    constructor(private auth: AuthService,
                private appService: AppService,
                private router: Router,
                private route: ActivatedRoute,
                public bookmarkService:BookmarkService) {

    }

    ngOnInit(){
        this.bookmarkService.getMyBookmarks().subscribe((data)=>{
            this.events = data;
        });
    }

    makeVertical(){
        this.verticalCard = true;
    }

    makeHorizontal(){
        this.verticalCard = false;
    }

}
