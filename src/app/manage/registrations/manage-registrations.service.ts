import { Injectable, EventEmitter } from '@angular/core';
import { AppService } from '../../services/app-service';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AuthService } from '../../auth/services/auth-service';

@Injectable()
export class ManageRegistrationsService {

    myPromotions$: AngularFireList<any>;
    myRegistrations$: AngularFireList<any>;

    constructor(private af: AngularFireDatabase, private auth: AuthService) {
        this.myPromotions$ = this.af.list(`/promoters/users/${this.auth.id}`);

        this.myRegistrations$ = this.af.list(`/registrations/users/${this.auth.id}`);


    }

    eventRegistration(id): Promise<AngularFireList<any>> {
        return new Promise((resolve, reject) => {
            if (!this.auth.authenticated) {
                this.auth.authObservable.first().subscribe(() => {
                    resolve(this.af.list(`/registrations/users/${this.auth.id}/${id}`));
                });
            } else {
                resolve(this.af.list(`/registrations/users/${this.auth.id}/${id}`));
            }
        });
    }


}
