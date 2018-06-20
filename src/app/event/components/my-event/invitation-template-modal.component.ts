import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastyService } from 'ng2-toasty';
import { AppService } from '../../../services/app-service';
import { AuthService } from '../../../auth/services/auth-service';
import { EventService } from '../../services/event-service';
import { AngularFireDatabase } from 'angularfire2/database/database';


@Component({
    selector: 'app-invitation-template-modal',
    styles: [
        `

            .modal-body{
                max-height: 680px;
                overflow: auto;
            }

        `
    ],
    template: `

<div ngbModalContainer>
    <div class="modal-body" style="padding:8%;padding-bottom:30px;">

        <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()" style="margin:15px 3px;">
            <span aria-hidden="true">×</span>
        </button>
    </div>
</div>

    `
})

export class InvitationTemplateModalComponent {

    constructor(public appService: AppService,
        public auth: AuthService,
        private router: Router,
        private af: AngularFireDatabase,
        public activeModal: NgbActiveModal,
        private eventService: EventService) {

    }




}
