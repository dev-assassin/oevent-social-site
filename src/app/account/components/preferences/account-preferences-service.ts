import { Injectable } from '@angular/core';
import { AccountService } from '../../services/account-service';
import { FirebaseObjectObservable, AngularFireDatabase } from 'angularfire2/database'
import { IAccountPreferences } from './preferences-model';
import { AuthService } from '../../../auth/services/auth-service';


@Injectable()
export class AccountPreferencesService {

    public prefs$: FirebaseObjectObservable<IAccountPreferences>;

    constructor(private accountService: AccountService, private auth: AuthService, private af: AngularFireDatabase) {
        this.prefs$ = this.af.object(`/preferences/${this.auth.id}`);
    }

}
