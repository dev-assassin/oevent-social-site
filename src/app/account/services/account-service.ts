import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/switchMap';

import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { IAccount, Account } from '../models/account';
import {Subject} from "rxjs";
import {AuthService} from "../../auth/services/auth-service";


@Injectable()
export class AccountService {

    destroyObservable:Subject<any> = new Subject();

    constructor(af: AngularFireDatabase, auth: AuthService) {
        //const path = `/tasks/${auth.id}`;
    }

    onDestroy(){
        this.destroyObservable.next(true);
    }

}
