import 'rxjs/add/operator/do';
import 'rxjs/add/operator/pluck';


import { Component, AfterContentInit, OnInit } from '@angular/core';
import { Router, NavigationEnd, RoutesRecognized, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../../auth/services/auth-service';
import { AppService } from '../../services/app-service';
import { OCodeService } from '../../services/ocode-service';

@Component({
    templateUrl: './discover.component.html',
    styles: [
        ``
    ],

})

export class DiscoverComponent implements OnInit {
    ocodes: any[] = [];

    constructor(private auth: AuthService, private appService: AppService,
        private ocodeService: OCodeService,
        private router: Router, private route: ActivatedRoute) {

    }

    ngOnInit() {
        this.ocodeService.getAllOcodes().subscribe((data) => {
            this.ocodes = data;
            let loggedInOcodeIndex = -1;
            this.ocodes.forEach((item, index) => {
                console.log(index + ' ' + item.uid + ' ' + this.auth.id);
                if (item.uid === this.auth.id) {
                    loggedInOcodeIndex = index;
                }
            });
            this.ocodes.splice(loggedInOcodeIndex, 1);
        });

    }

}
