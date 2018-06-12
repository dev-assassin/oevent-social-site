import {Component, AfterContentInit, OnInit, Input} from '@angular/core';
import {Router, NavigationEnd, RoutesRecognized, ActivatedRoute, Params} from '@angular/router';
import {AppService} from "../../../services/app-service";
import {AuthService} from "../../../auth/services/auth-service";
import {CreateEventService} from "../../services/create-event.service";

@Component({
    selector: 'event-type',

    template: `
        <div>
            <label>
               Event Type
            </label>
        </div>
        <div>        
            <label>
                <input type="radio" [(ngModel)]="type" name="type" value="local" (click)="saveType()" />&nbsp; Local
            </label>
            <label style="padding-left:15px;">
                <input type="radio" [(ngModel)]="type" name="type" value="online" (click)="saveType()" />&nbsp; Online
            </label>            
        </div>
        
    `,
    styles: [
        `
            :host{
                display:block;
            }  
        `
    ],

})

export class EditTypeComponent implements OnInit{

    type:string;

    constructor(private auth: AuthService,
                private appService: AppService,
                private router: Router,
                private route: ActivatedRoute,
                private createService: CreateEventService) {

    }

    ngOnInit(){
        this.type = this.createService.draft.type;
    }

    saveType(){
        //GIVE IT A HALF A SECOND TO UPDATE THE MODEL AFTER CLICK
        setTimeout(()=>{
            this.createService.draftObject$.update({type:this.type}).then(()=>{this.createService.showSavedDraft();});
        }, 500);

    }


}