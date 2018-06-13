import { Component, AfterContentInit, OnInit } from '@angular/core';
import { Router, NavigationEnd, RoutesRecognized, ActivatedRoute, Params } from '@angular/router';
import { AppService } from '../../../services/app-service';
import { AuthService } from '../../../auth/services/auth-service';
import { PreviewService } from '../../services/preview.service';

@Component({
    templateUrl: './preview.component.html',
    styles: [
        ``
    ],

})

export class PreviewComponent implements OnInit {

    idSet: Boolean = true;
    eventId: string;

    constructor(private auth: AuthService,
        private appService: AppService,
        private router: Router,
        private route: ActivatedRoute, private previewService: PreviewService) {

    }

    ngOnInit() {
        this.eventId = this.previewService.eventId;
        this.idSet = true;
    }


}
