import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastyService } from 'ng2-toasty';
import { FirebaseApp, AngularFireModule } from 'angularfire2';
import { AuthService } from '../../auth/services/auth-service';
import { AppService } from '../../services/app-service';
import { AccountContactService } from '../../shared-module/services/account-contact-service';
import { AccountMeService } from '../../shared-module/services/account-me-service';
import { NotificationType } from '../enum/notificationType';
import { AngularFireDatabase } from 'angularfire2/database/database';
import { FormBuilder } from '@angular/forms';
import { NotificationSettingEnum } from '../enum/NotificationSettingEnum';
import { UserNotificationSetting } from '../models/UserNotificationSetting';
import { NotificationSettingService } from '../services/notification-setting.service';

@Component({
    selector: 'app-notif-settings',
    styles: [
        `
            .login-error{padding-bottom:15px;}
        `
    ],
    templateUrl: './notification-settings.component.html'
})

export class NotificationSettingsComponent implements OnInit {
    email: string;
    notificationType = NotificationType;
    notificationSettingsEnum: NotificationSettingEnum;
    userNotifSettingsMap: Map<string, UserNotificationSetting>;

    keys: string[];

    constructor(
        private af: AngularFireDatabase,
        private notificationSettingService: NotificationSettingService,
        public appService: AppService,
        public auth: AuthService,
        private router: Router,
        public activeModal: NgbActiveModal,
        public toasty: ToastyService,
        private contactService: AccountContactService,
        private aboutService: AccountMeService,
        private app: FirebaseApp
    ) {
        this.userNotifSettingsMap = new Map<string, UserNotificationSetting>();
        this.keys = new Array();
    }
    ngOnInit(): void {
        this.loadNotificationSettings();
    }


    loadNotificationSettings() {
        const options = Object.keys(NotificationSettingEnum);
        let i: number;
        while (i <= options.length) {
            if (options[i] != null) {
                this.keys.push(options[i]);
                this.userNotifSettingsMap.set(String(options[i]), new UserNotificationSetting());
            }
            i = i + 2;
        }
        this.notificationSettingService.getUserNotificationSettings(this.auth.id).subscribe((data) => {
            if (data.$exists()) {
                for (const key of this.keys) {
                    if (data[String(key)] != null) {
                        this.userNotifSettingsMap.set(String(key), data[String(key)]);
                    }
                }
            } else {
                console.log('User notification settings has not been set yet');
            }
        });
    }

    login() {
        this.appService.openLogin();
    }

    disableCheckBox(key: string): boolean {
        return NotificationSettingEnum[key] === NotificationSettingEnum.BILLING_NOTICE_EXPIRING_CREDIT_CARD;
    }

    notificationSettingLabel(key: string): string {
        return NotificationSettingEnum[key];
    }

    notifSettingChanged(setting: string) {
        this.appService.startLoadingBar();
        this.notificationSettingService.updateUserNotificationSetting(this.auth.id, setting, this.userNotifSettingsMap.get(setting));
        this.appService.stopLoadingBar();
    }

}
