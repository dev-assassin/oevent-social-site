import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../auth/services/auth-service";
import {AccountSocialService} from "./account-social-service";
import {AngularFireDatabase} from "angularfire2/database/database";
import {FirebaseObjectObservable} from "angularfire2/database/firebase_object_observable";
import {Form} from "@angular/forms";
import {AppService} from "../../../services/app-service";
import {ToastyService} from "ng2-toasty";

@Component({
    selector: 'account-social',
    styles: [

    ],
    template: `
        <h3 class="line">
            Manage Social Media (TODO)
        </h3>

        <h4>Display your Social Media Links on your Profile</h4>
        
        <form #socialsForm="ngForm" (ngSubmit)="onSubmit(socialsForm)" novalidate *ngIf="socialsSet">
            <div class="row"> 
                <div class="col-1"> 
                    <ui-switch [(ngModel)]="socials.facebookToggle" name="facebookToggle" size="small" ></ui-switch>
                </div>
                <div class="col-11"> 
                    <strong>Facebook</strong>
                </div>
            </div>
            
            <div class="row margin-vertical-sm"> 
                <div class="col-11 offset-1"> 
                    <label> Facebook URL </label>
                    <input type="text" 
                        [(ngModel)]="socials.facebook" 
                        [disabled]="!socials.facebookToggle" 
                        id="facebook"
                        name="facebook"
                        #facebook="ngModel"
                        [required]="socials.facebookToggle"
                        pattern="^(https?:\/\/){0,1}(www.){0,1}facebook.com\/[^\/]+"
                        class="form-control" 
                        placeholder="www.facebook.com/yourname"/>
                        
                    <div *ngIf="socials.facebookToggle && facebook.errors && (facebook.touched || facebook.dirty || facebook.submitted)" class="validation-error-text">
                        Please type in a valid facebook URL
                    </div>
                </div>
            </div>
            
            <div class="row c-margin-t-30"> 
                <div class="col-1"> 
                    <ui-switch [(ngModel)]="socials.twitterToggle" name="twitterToggle" size="small" ></ui-switch>
                </div>
                <div class="col-11"> 
                    <strong>Twitter</strong>
                </div>
            </div>
            
            <div class="row margin-vertical-sm"> 
                <div class="col-11 offset-1"> 
                    <label> Twitter URL </label>
                    <input type="text" 
                    [(ngModel)]="socials.twitter" 
                    [disabled]="!socials.twitterToggle" 
                    id="twitter"
                    name="twitter"
                    #twitter="ngModel"
                    [required]="socials.twitterToggle"
                    pattern="^(https?:\/\/){0,1}(www.){0,1}twitter.com\/[^\/]+"
                    class="form-control" 
                    placeholder="www.twitter.com/yourhandle"/>
                    
                    <div *ngIf="socials.twitterToggle && twitter.errors && (twitter.touched || twitter.dirty || twitter.submitted)" class="validation-error-text">
                        Please type in a valid twitter URL
                    </div>
                    
                </div>
                
                
                
            </div>
            
            <div class="row c-margin-t-30"> 
                <div class="col-1"> 
                    <ui-switch [(ngModel)]="socials.googlePlusToggle" name="googlePlusToggle" size="small" ></ui-switch>
                </div>
                <div class="col-11"> 
                    <strong>Google Plus</strong>
                </div>
            </div>
            
            <div class="row margin-vertical-sm"> 
                <div class="col-11 offset-1"> 
                    <label> Google Plus URL </label>
                    <input 
                        type="text" 
                        [(ngModel)]="socials.googlePlus" 
                        [disabled]="!socials.googlePlusToggle" 
                        id="googlePlus"
                        name="googlePlus"
                        #googlePlus="ngModel"
                        [required]="socials.googlePlus"
                        pattern="^(https?:\/\/){0,1}(plus.){0,1}google.com\/[^\/]+"
                        class="form-control" 
                        placeholder="plus.google.com/yourname"/>
                        
                    <div *ngIf="socials.googlePlusToggle && googlePlus.errors && (googlePlus.touched || googlePlus.dirty || googlePlus.submitted)" class="validation-error-text">
                        Please type in a valid Google Plus URL
                    </div>
                        
                </div>
            </div>
            
            <div class="row c-margin-t-30"> 
                <div class="col-1"> 
                    <ui-switch [(ngModel)]="socials.linkedInToggle" name="linkedInToggle" size="small" ></ui-switch>
                </div>
                <div class="col-11"> 
                    <strong>Display LinkedIn</strong>
                </div>
            </div>
            
            <div class="row margin-vertical-sm"> 
                <div class="col-11 offset-1"> 
                    <label> LinkedIn URL </label>
                    <input type="text" 
                        [(ngModel)]="socials.linkedIn" 
                        [disabled]="!socials.linkedInToggle"
                        id="linkedIn"
                        name="linkedIn"
                        #linkedIn="ngModel"
                        [required]="socials.linkedInToggle"
                        pattern="^(https?:\/\/){0,1}(www.){0,1}linkedin.com\/[^\/]+"
                        class="form-control" 
                        placeholder="www.linked.com/yourname"/>
                      
                    <div *ngIf="socials.linkedInToggle && linkedIn.errors && (linkedIn.touched || linkedIn.dirty || linkedIn.submitted)" class="validation-error-text">
                        Please type in a valid LinkedIn URL
                    </div>
                        
                </div>
            </div>
            
            <button type="submit" class="btn btn-lg btn-primary c-margin-t-30"> 
                Save
            </button>
            
        </form>
        
        
            
    `
})

export class AccountSocialComponent implements OnInit{

    socialsSet:boolean = false;
    socials:Socials = new Socials();
    socials$:FirebaseObjectObservable<Socials>; 

    constructor(private auth: AuthService, 
                private af:AngularFireDatabase,
                private appService:AppService,
                private toasty:ToastyService,
                private socialService: AccountSocialService){
        
    }
    
    ngOnInit(){        
        this.socials$ = this.af.object(`/socials/${this.auth.id}`);
        this.socials$.first().subscribe((socials)=>{
            if(socials.$exists()){
                this.socials = socials;
                this.socialsSet = true;
            }
            else{
                this.socialsSet = true;
            }

        })
    }

    onSubmit(form:any){

        console.log(form.valid, form.errors);

        if(form.valid){
            let cleanedValues = {};
            let values = form.value;

            for(let key in values){
                if(typeof values[key] != "undefined"){
                    cleanedValues[key] = values[key];
                }
            }

            try {

                this.appService.startLoadingBar();

                this.socials$.set(cleanedValues).then(()=>{
                    this.appService.completeLoadingBar();
                    this.toasty.success("Your social media information has been saved!");
                }, (err)=>{

                    let toast = {
                        title: "Failed",
                        msg: `Your social media information was not saved: ${err.message}`
                    };
                    this.appService.completeLoadingBar();
                    this.toasty.error(toast);

                });

            }
            catch(err){
                let toast = {
                    title: "Failed",
                    msg: `Your social media information was not saved: ${err}`
                };
                this.appService.completeLoadingBar();
                this.toasty.error(toast);
            }
        }
    }

}

export class Socials{
    facebookToggle:boolean = false;
    twitterToggle:boolean = false;
    linkedInToggle:boolean = false;
    googlePlusToggle:boolean = false;
    googlePlus:string = null;
    twitter:string = null;
    linkedIn:string = null;
    facebook:string = null;
}
