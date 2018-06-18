import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EventService } from '../../../services/event-service';
import { FirebaseListObservable } from 'angularfire2/database/firebase_list_observable';

import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { InviteEmail } from '../../../models/invite-email';

@Component({
    selector: 'app-update-email',
    styles: [
    ],
    templateUrl: './update-email-modal.html'
})

export class UpdateEmailModalComponent implements OnInit {
    inviteEmail$: FirebaseObjectObservable<any>;
    inviteEmail: InviteEmail;

    constructor(public activeModal: NgbActiveModal,
        public eventService: EventService
    ) {

        if (eventService.set) {
            this.setInviteEmail();
        } else {
            this.eventService.eventUpdated.first().subscribe(() => {
                this.setInviteEmail();
            });
        }


    }

    setInviteEmail() {
        if (this.eventService.inviteKey !== 'promoter') {
            this.inviteEmail$ = this.eventService.getInviteEmail(this.eventService.selectedInviteEmailKey);
        } else {
            this.inviteEmail$ = this.eventService.getPromoterInviteEmail(this.eventService.selectedInviteEmailKey);
        }

        this.inviteEmail = new InviteEmail();

        this.inviteEmail$.subscribe((data) => {
            this.inviteEmail = data;
        });

    }

    ngOnInit(): void {

    }

    save() {
        this.inviteEmail$.set(this.inviteEmail);
        this.activeModal.dismiss();
    }

    cancel() {
        this.activeModal.dismiss();
    }

}
