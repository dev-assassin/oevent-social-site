import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/switchMap';

import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { FirebaseApp } from 'angularfire2';
import { AuthService } from '../../auth/services/auth-service';

@Injectable()
export class EmailActionService {

    constructor(private af: AngularFireDatabase,
        private auth: AuthService,
        private app: FirebaseApp) {

    }

    public resetPassword(code, newPassword) {
        return this.app.auth().confirmPasswordReset(code, newPassword);
    }

    public verifyCode(code) {
        return this.app.auth().verifyPasswordResetCode(code);
    }

}
