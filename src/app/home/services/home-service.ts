import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/switchMap';

import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AuthService } from '../../auth/services/auth-service';

@Injectable()
export class HomeService {

    constructor(af: AngularFireDatabase, auth: AuthService) {

    }
}
