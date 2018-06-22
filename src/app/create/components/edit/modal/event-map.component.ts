import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateEventService } from '../../../services/create-event.service';
import { IGPS } from '../../../../shared-models/gps';

@Component({
    selector: 'app-event-map',
    styles: [
        `
                    agm-map {
                         height: 300px;
                         width:350px;
                    }
                   `
    ],
    template: `
    <div ngbModalContainer>
        <div class="modal-body" >
            <div>
                <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()"
                    style="margin:15px 3px;"><span aria-hidden="true">×</span></button>
            </div>
            <div>
                <agm-map [latitude]="gps.lat" [longitude]="gps.lng">
                  <agm-marker [latitude]="gps.lat" [longitude]="gps.lng"></agm-marker>
                </agm-map>
            </div>
        </div>
    </div>
`
})

export class EventMapComponent implements OnInit {
    gps: IGPS;

    constructor(public activeModal: NgbActiveModal,
        private createService: CreateEventService) {
    }

    ngOnInit(): void {
        this.gps = this.createService.draft.gps;
    }

}
