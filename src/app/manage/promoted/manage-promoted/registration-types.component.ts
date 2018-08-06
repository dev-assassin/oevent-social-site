import {Component, OnInit} from '@angular/core';
import {AngularFireDatabase} from "angularfire2/database"
import {EventService} from "../../../event/services/event-service";

@Component({
    selector:'my-event-registration-type',
    template: `
        <h3 class="line" style="margin-bottom:0px;">
            {{ eventService.event.title }} - Registration Types
        </h3>
        
        <div class="row row-eq-height">
            <div 
                *ngFor="let regType of eventService.eventTickets$ | async" 
                promoter-registration-type-detail 
                [regType]="regType" 
                class="col-md-4">
                </div>
                
                
        </div>
        
    `,
    styles: [
        `
       
        `
    ]

})

export class PromotedRegistrationTypesComponent implements OnInit{

    constructor(public eventService: EventService) {

    }

    ngOnInit(){

    }
}