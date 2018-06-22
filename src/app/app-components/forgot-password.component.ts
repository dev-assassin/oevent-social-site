import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/services/auth-service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from '../services/app-service';
import { ToastyService } from 'ng2-toasty';
import { AccountContactService } from '../shared-module/services/account-contact-service';
import { AccountMeService } from '../shared-module/services/account-me-service';
import { IAccountContact } from '../account/components/contact/contact-model';
import { FirebaseApp, AngularFireModule } from 'angularfire2';

@Component({
    selector: 'app-fl-forgot-password',
    styles: [
        `
            .login-error{padding-bottom:15px;}
        `
    ],
    templateUrl: './forgot-password.component.html'
})

export class ForgotPasswordComponent {
    email: string;
    emailSent = false;

    constructor(
        public appService: AppService,
        public auth: AuthService,
        private router: Router,
        public activeModal: NgbActiveModal,
        public toasty: ToastyService,
        private contactService: AccountContactService,
        private aboutService: AccountMeService,
        private app: FirebaseApp
    ) {
    }

    login() {
        this.appService.openLogin();
    }

    onSubmit(form) {

        if (form.valid) {
            const email = form.controls['email'].value;

            this.app.auth().sendPasswordResetEmail(email).then(() => {
                this.emailSent = true;
            }, () => {

            });

        }

    }

}
