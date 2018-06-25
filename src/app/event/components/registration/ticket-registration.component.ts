import {Component, AfterContentInit, OnInit, AfterViewInit, Input, Output, EventEmitter} from '@angular/core';
import {ITicketRegistration} from "../../models/ticket-registration";
import * as _ from 'lodash';
import {EventService} from "../../services/event-service";
import {FieldValidation} from "../../../../assets/common/validation/field-validation";


@Component({
    selector: "single-registration",
    template: `
            
            <div *ngIf="!singleInputChild">
                {{registrationTicketToBeSubmitted(registration)}}
                <h4 style="margin-top:45px;margin-bottom:5px;">
                    {{ registration.ticketName }} 
                    <span *ngIf="singleInputParent">({{ registration.catQty }}  tickets)</span>
                </h4>
                
                <div class="row">
                
                        <div class="col-md-6" *ngFor="let field of registration.fields" [hidden]="!field.value.enabled" style="margin-top:.75rem">
            
                        <div *ngIf="field.value.enabled">
                        
                            <div *ngIf="field.data.type === 'checkbox'" style="padding-top:1.5rem">
                                <label>
                                <input
                                    type="checkbox"
                                    [(ngModel)]="field.input" />
                                    {{ field.data.label }} 
                                </label>
                            </div>
            
                            <div *ngIf="field.data.type === 'text'">
                                <label>{{ field.data.label }}</label> <span style="color:red" *ngIf="field.value.required">*</span>
                                <div>
                                    <input
                                        type="text"
                                        class="form-control"
                                        required
                                        [(ngModel)]="field.input"
                                        [required]="field.value.required" />
                                </div>
                                <div  class="validation-error-text" *ngIf="!isFieldValid(index,field.key)">Required field</div> 
                            </div>
            
                            <div *ngIf="field.data.type === 'select'">
                                <label>{{ field.data.label }}</label> <span style="color:red" *ngIf="field.value.required">*</span>
                                <div>
                                    <custom-input-select
                                        [(ngModel)]="field.input"
                                        [inputValue]="field.input"
                                        [values]="field.data.values"
                                        [required]="field.value.required"
                                        ngDefaultControl ></custom-input-select>
                                </div>
                                <div  class="validation-error-text" *ngIf="!isFieldValid(index,field.key)">Required field</div>
                            </div>
                                                         
                            <div *ngIf="field.data.type == 'date'">
                                <label>{{ field.data.label }}</label>  <span style="color:red" *ngIf="field.value.required">*</span>
                                <div class="input-group">
                                    <input 
                                        id="event-date" 
                                        class="form-control" 
                                        ngbDatepicker 
                                        #startDate="ngbDatepicker"
                                        type="text"
                                        [(ngModel)]="field.input" 
                                        (click)="startDate.toggle()">
                                           
                                           <!-- (blur)="saveTheDate()" (change)="saveTheDate()" -->
            
                                    <span class="input-group-addon">
                                        <span class="fa fa-calendar" (click)="startDate.toggle(); "></span>
                                    </span>
            
                                </div>
                                <div  class="validation-error-text" *ngIf="!isFieldValid(index,field.key)">Required field</div>
                            </div>
            
                    </div>
            
            
                </div>
                    
            </div>
        </div>
        
    `,
    styles: [
        `

        `
    ]

})

export class SingleRegistrationComponent implements OnInit{

    @Input() registration:ITicketRegistration;
    @Input() fields:any[];
    @Input() index:number;
    @Input() fieldValidations:Map<string,FieldValidation>;
    singleInputParent:boolean = false;
    singleInputChild:boolean = false;
    total:number = 1;

    constructor(private eventService:EventService) {

    }

    ngOnInit(){
        let fieldsClone = JSON.parse(JSON.stringify(this.fields));
        this.registration.fields = fieldsClone;

        if(this.registration.showMulti == false && this.registration.buyMultiple == true){
            if(this.eventService.registerMultiSingleInput(this.index, this.registration.ticketRef)){
                this.setAsParent();
            }
            else{
                this.setAsChild();
            }
        }
    }

    setAsParent(){
        this.singleInputParent = true;
        this.eventService.setSingleParentEmitter(this.registration.ticketRef);
        this.registration.multiParent = true;
        this.eventService.submissionEmitter.subscribe(()=>{
           this.eventService.childInputListener[this.registration.ticketRef].emit({registration: this.registration, index:this.index});
        });
    }

    setAsChild(){
        this.singleInputChild = true;
        this.eventService.childInputListener[this.registration.ticketRef].subscribe((data)=>{
            let regClone = JSON.parse(JSON.stringify(data.registration));
            this.registration.fields = regClone.fields;
            this.registration.multiChild = true;
            this.eventService.addSingleMultiQty(data.index);
        });
    }

    isFieldValid(index,fieldKey):boolean{
        let key = `${index}_${fieldKey}`;
        if(this.fieldValidations.get(key) && !this.fieldValidations.get(key).valid){
            return false;
        }
        return true;

    }

    registrationTicketToBeSubmitted(registration){
        registration.set = true;
    }

}
