import { Injectable, EventEmitter } from '@angular/core';
import {AppService} from "../../services/app-service";
import {AngularFireDatabase, FirebaseListObservable} from "angularfire2/database"
import {AuthService} from "../../auth/services/auth-service";

@Injectable()
export class ManageRegistrationsService {

    myPromotions$:FirebaseListObservable<any>;
    myRegistrations$:FirebaseListObservable<any>;

    constructor(private af:AngularFireDatabase, private auth:AuthService){
        this.myPromotions$ = this.af.list(`/promoters/users/${this.auth.id}`, {
            //TODO FIGURE OUT HOW AND WHEN TO FILTER OUT OLD EVENTS
        });

        this.myRegistrations$ = this.af.list(`/registrations/users/${this.auth.id}`, {
            //TODO FILTER OUT OLD ETC...
        });


    }

    eventRegistration(id):Promise<FirebaseListObservable<any>>{
        return new Promise((resolve, reject)=>{
            if(!this.auth.authenticated){
                this.auth.authObservable.first().subscribe(()=>{
                    resolve(this.af.list(`/registrations/users/${this.auth.id}/${id}`));
                })
            }
            else{
                resolve(this.af.list(`/registrations/users/${this.auth.id}/${id}`));
            }
        });
    }


}