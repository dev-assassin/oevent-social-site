import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/switchMap';

import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AppService } from '../../services/app-service';
import { AuthService } from '../../auth/services/auth-service';

@Injectable()
export class FollowingService {

    constructor(private af: AngularFireDatabase,
        private auth: AuthService,
        private appService: AppService) {

    }

    getMyFollows(): FirebaseListObservable<any[]> {
        return this.af.list(`/follows/${this.auth.id}`);
    }

    getMyFollowers(): FirebaseListObservable<any[]> {
        return this.af.list(`/followers/${this.auth.id}`);
    }

    getFollows(id): FirebaseListObservable<any[]> {
        return this.af.list(`/follows/${id}`);
    }

    getFollowers(id): FirebaseListObservable<any[]> {
        return this.af.list(`/followers/${id}`);
    }

    checkFollow(id): FirebaseObjectObservable<any> {
        return this.af.object(`/followers/${id}/${this.auth.id}`);
    }

    setFollowAndFollower(id, profileContact): Promise<any> {
        this.af.object(`/about/${id}`).first().subscribe((aboutData) => {
            const followingUser = {
                followerImageUrl: this.appService.userImage,
                followerName: (this.appService.about.organizerName) ? this.appService.about.organizerName : '',
                followerEmail: (this.appService.contact && this.appService.contact.email) ? this.appService.contact.email : '',
                followingImageUrl: aboutData.imageURL,
                followingName: aboutData.organizerName,
                followingEmail: (profileContact && profileContact.email) ? profileContact.email : ''
            };
            this.af.list(`pending-notifications/following-user`).push(followingUser);
        });


        return new Promise((resolve, reject) => {
            this.af.object(`/follows/${this.auth.id}/${id}`).set({ 'set': true }).then(() => {
                this.af.object(`/followers/${id}/${this.auth.id}`).set({ 'set': true }).then(() => {
                    resolve();
                });
            });
        });
    }

    removeFollowAndFollower(id): Promise<any> {
        return new Promise((resolve, reject) => {
            this.af.object(`/follows/${this.auth.id}/${id}`).remove().then(() => {
                this.af.object(`/followers/${id}/${this.auth.id}`).remove().then(() => {
                    resolve();
                });
            });
        });
    }

}
