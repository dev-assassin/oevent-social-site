import { Component, AfterContentInit, OnInit, Input, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd, RoutesRecognized, ActivatedRoute, Params } from '@angular/router';
import { AuthService } from '../../../auth/services/auth-service';
import { EventService } from '../../services/event-service';
import { IoEvent } from '../../../shared-models/oevent';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangeStatusModalComponent } from './change-status.component';
declare var Quill: any;

@Component({
    selector: 'app-my-event-details',
    templateUrl: `../detail-component.html`,
    styles: [
        `
            .register-table tr td{
                padding-right:2rem;
            }

            .register-table tr td:last-child{
                padding-right:0;
            }

            .row.row-vertical{
                padding-bottom:1rem;
            }
        `
    ],
    providers: [NgbActiveModal]

})

export class MyEventDetailsComponent implements OnInit, AfterViewInit {

    @Input() event: IoEvent;
    description: any;
    keywordString = '';
    keywordsBuilt = false;

    // TRACK IF DATA HAS BEEN LOADED FROM FIREBASE
    set = false;

    constructor(private auth: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        public eventService: EventService,
        private activeModal: NgbActiveModal,
        private modalService: NgbModal) {

    }

    ngOnInit() {

    }

    ngAfterViewInit() {

        // USING SET INTERVAL UNTIL THE DATA IS SET SINCE THE PROPER CONTAINER IS NOT LOADED UNTIL SET IT SET
        const doCheck = setInterval(() => {

            if (this.eventService.set) {

                if (!this.keywordsBuilt) {
                    this.buildKeywordString();
                }

                // ALLOW TIME FOR ANG2 TO REACT
                setTimeout(() => {

                    // INSTANTIATE BASED ON ID
                    this.description = new Quill('#description', {
                        readOnly: true
                    });

                    this.description.setContents(this.eventService.event.description);

                    clearInterval(doCheck);

                }, 150);
            }

        }, 100);
    }

    openPromoter() {

    }

    buildKeywordString() {
        const keywords: string[] = this.eventService.event.keywords;
        console.log(keywords);
        if (keywords) {
            let keywordString = '';

            for (let i = 0; i < keywords.length; i++) {
                keywordString += keywords[i];
                if ((i + 1) < keywords.length) {
                    keywordString += ', ';
                }
            }

            console.log(keywordString);

            this.keywordString = keywordString;
            this.keywordsBuilt = true;
        }
    }

    changeStatus() {
        this.activeModal.dismiss();
        const changeStatus = this.modalService.open(ChangeStatusModalComponent);
        changeStatus.componentInstance.name = 'Change';
    }
}
