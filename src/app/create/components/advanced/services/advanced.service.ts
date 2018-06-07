import {Injectable, OnDestroy, EventEmitter} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import {EventSettings} from "../models/advanced-settings";
import {AuthService} from "../../../../auth/services/auth-service";

@Injectable()
export class CreateAdvancedService{

    eventId:string;
    eventSettings:EventSettings;
    eventSettings$:FirebaseObjectObservable<any> = new FirebaseObjectObservable();
    eventSet:boolean = false;
    waitForSet:EventEmitter<any> = new EventEmitter();

    constructor(private af: AngularFireDatabase,
                private auth: AuthService
    ) {

    }

    setEventId(id){

        console.log(id);

        this.eventId = id;
        this.eventSettings$ = this.af.object(`events/settings/${id}`);

        //CHECK IF SETTINGS EXISTS, IF NOT CREATE AND SAVE NEW SETTINGS
        this.checkExists().then((exists:boolean)=>{
            if(!exists){
                this.eventSettings = new EventSettings();
                this.eventSettings$.set(this.eventSettings).then(()=>{

                    //WATCH FOR ANY CHANGES TO THE SETTINGS AND UPDATE
                    this.eventSettings$.subscribe((data)=>{
                       this.eventSet = true;

                       delete data.$exists;
                       delete data.createdAt;
                       delete data.$key;

                       this.eventSettings = data;
                        this.waitForSet.emit();
                    });
                })
            }
            else{
                //WATCH FOR ANY CHANGES TO THE SETTINGS AND UPDATE
                this.eventSettings$.subscribe((data)=>{
                    this.eventSet = true;

                    delete data.$exists;
                    delete data.createdAt;
                    delete data.$key;

                    this.eventSettings = data;

                    this.waitForSet.emit();
                });
            }
        })
    }

    checkExists():Promise<any>{
        return new Promise((resolve, reject)=>{
            this.eventSettings$.first().subscribe((data)=>{
               resolve(data.$exists());
            });
        })
    }


}
