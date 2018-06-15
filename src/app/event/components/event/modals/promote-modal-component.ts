import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../auth/services/auth-service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from '../../../../services/app-service';
import { ToastyService } from 'ng2-toasty';
import { EventService } from '../../../services/event-service';

@Component({
    selector: 'app-promote-modal',
    styles: [
        `
            .login-error{padding-bottom:15px;}
        `
    ],
    template: newFunction()
})

export class PromoteModalComponent {

    promoted = false;

    constructor(public appService: AppService,
        public auth: AuthService,
        public activeModal: NgbActiveModal,
        private eventService: EventService) {
        this.eventService.checkPromoter().subscribe((data) => {
            if (data.$exists()) {
                this.promoted = true;
            } else {
                this.promoted = false;
            }

        });
    }

    addPromoter() {
        this.eventService.addPromoter();
    }

}
function newFunction(): string {
    return `
       <div ngbModalContainer>
            <div class="modal-body" style="padding-bottom:30px;">
                <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()" style="margin:10px 15px;">
                    <span aria-hidden="true">×</span>
                </button>

                <h3 class="line">Promote this event!</h3>

                <div *ngIf="!promoted">
                    <p>
                        You are about to promote <strong>Brianne Hovey's</strong> event, <strong>Intro to Essential Oils</strong>.
                    </p><br />

                    <p>
                        This event will be added to your promoted events
                    </p>

                    <div class="padding-vertical text-center">
                        <a (click)="activeModal.dismiss()" class="btn btn-default">
                            Cancel
                        </a>
                        <a (click)="addPromoter()" class="btn btn-primary" *ngIf="!promoted">
                            Add to Promoted Events
                        </a>

                    </div>
                </div>

                <div *ngIf="promoted" style="margin-bottom:60px;">
                    <o-invite
                        [hideButtonText]="true"
                        [eventId]="eventService.eventId"
                        [ocode]="appService.ocode"
                        [title]="eventService.event.title"
                        [description]="eventService.event.descriptionText"
                        [imagePath]="eventService.event.imagePath"></o-invite>
                </div>

            </div>
        </div>
    `;
}

