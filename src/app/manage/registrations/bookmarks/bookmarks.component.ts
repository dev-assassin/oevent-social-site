import 'rxjs/add/operator/do';
import 'rxjs/add/operator/pluck';

import {Component, AfterContentInit} from '@angular/core';
import {Router, NavigationEnd, RoutesRecognized} from '@angular/router';
import {AuthService} from "../../../auth/services/auth-service";
import {ManageRegistrationsService} from "../manage-registrations.service";
import {BookmarkService} from "../../../shared-module/services/bookmark.service";

@Component({
    templateUrl: './bookmarks.html',
    styles: [

    ]
})

export class RegistrationsBookmarksComponent{
    events:any[] = [];

    constructor(private auth: AuthService, private router: Router,
                public bookmarkService:BookmarkService,
                public promotionsService: ManageRegistrationsService) {

    }

    ngOnInit(){
        this.bookmarkService.getMyBookmarks().subscribe((data)=>{
            this.events = data;
        });
    }

}
