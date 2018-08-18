import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/switchMap';

import { Injectable } from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import {IoEvent} from "../../shared-models/oevent";
import {Observable} from "rxjs";
import {AuthService} from "../../auth/services/auth-service";

@Injectable()
export class MembershipService {

    membership$:FirebaseObjectObservable<any> = new FirebaseObjectObservable();

    constructor(public af: AngularFireDatabase, public auth: AuthService) {
        this.membership$ = this.af.object(`/membership/${this.auth.id}`);
    }

    getMembership():Promise<any>{

        return new Promise((resolve, reject)=>{
            this.membership$.first().subscribe((data)=>{
                resolve(data);
            });
        });

    }

    setMembership(membershipType:string){
        return this.membership$.set({membershipType:membershipType});
    }

}