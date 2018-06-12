import {Component, AfterContentInit, OnInit, Input} from '@angular/core';
import {Router, NavigationEnd, RoutesRecognized, ActivatedRoute, Params} from '@angular/router';
import {AppService} from "../../../services/app-service";
import {AuthService} from "../../../auth/services/auth-service";
import {CreateEventService} from "../../services/create-event.service";
import {FieldValidation} from "../../../../assets/common/validation/field-validation";

@Component({
               selector: 'event-title',

               template: `
        <div class="{{!createService.isFieldValid('title')?'has-error':''}}">
        <label>
            Event Name
        </label>
        <input type="text" id="title" class="form-control" [(ngModel)]="title" (blur)="saveTitle()"/>
        <div *ngIf="!createService.isFieldValid('title')" class="validation-error-text">{{createService.fieldValidations.get("title").errorMessage}}</div> 
        </div>
    `,
               styles: [
                   `
            :host{
                width:100%;
            }  
        `
               ],

           })

export class EditTitleComponent implements OnInit
{

    title: string;

    constructor(private auth: AuthService,
                private appService: AppService,
                private router: Router,
                private route: ActivatedRoute,
                private createService: CreateEventService)
    {

    }

    ngOnInit()
    {
        this.title = this.createService.draft.title;
    }

    saveTitle()
    {
        this.createService.initValidationField("title");
        if (this.title && this.title.trim() != "") {
            this.createService.draftObject$.update({"title": this.title, "status":"draft"})
                .then(()=>
                      {
                          this.createService.showSavedDraft();
                      });

            if (this.createService.isLive()) {
                this.createService.publish()
            }

        }
        else {
            this.createService.setErrorInField("title","Event name is a required field");
        }

    }


}
