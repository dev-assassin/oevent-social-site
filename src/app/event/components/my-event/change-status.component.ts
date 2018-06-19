import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event-service';
import { AngularFireDatabase } from 'angularfire2/database';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateEventService } from '../../../create/services/create-event.service';
import { AuthService } from '../../../auth/services/auth-service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-my-event-change-status',
    templateUrl: './change-status.component.html',
    styles: [
        `
            .modal-body{
                max-height: 680px;
                overflow: auto;
            }
            .row.align-items-center{
                margin-bottom:1rem;
            }
            h4 .fa-check{
                display:none;
            }
            .active h4 .fa-check{
                display:inline-block;
            }
            .active h4{
                color:#26C6DA;
            }
            .active button{
            }
            .active button {
              opacity: 0.65;
              cursor: not-allowed;
            }
        `
    ]

})

export class ChangeStatusModalComponent implements OnInit {
    draftStatus: string;

    constructor(private auth: AuthService,
        private af: AngularFireDatabase,
        public eventService: EventService,
        public router: Router,
        public activeModal: NgbActiveModal,
        public createService: CreateEventService) {

    }

    ngOnInit() {
        this.createService.setEventId(this.eventService.eventId);
        this.draftStatus = this.createService.draft.status;

    }

    changeStatus(status) {

        if (status === 'closed') {
            this.af.list(`/pending-notifications/event-closed`).push({
                eventImageUrl: this.eventService.event.imagePath,
                eventTitle: this.eventService.event.title,
                eventId: this.eventService.eventId
            });
        } else if (status === 'cancelled') {
            this.af.list(`/pending-notifications/event-cancelled`).push({
                eventImageUrl: this.eventService.event.imagePath,
                eventTitle: this.eventService.event.title,
                eventId: this.eventService.eventId
            });
        }

        this.eventService.event$.update({ 'liveStatus': status });
    }

    unpublish() {
        this.createService.publish(false);
        this.router.navigateByUrl('/manage/organized/drafts');
        this.activeModal.dismiss();
    }


}
