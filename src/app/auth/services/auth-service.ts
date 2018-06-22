import { Injectable, Inject } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { FirebaseApp, AngularFireModule } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs';
import { IFile, File } from '../models/file';
import * as firebase from 'firebase/app';
import User = firebase.User;
import { AngularFireDatabase } from 'angularfire2/database/database';
import { IAccountContact } from '../../account/components/contact/contact-model';


@Injectable()
export class AuthService {
  authState$: Observable<firebase.User>;
  uid$: Observable<string>;
  public user: firebase.User;
  emailSub: Observable<string>;
  email = '';
  public authObservable: Subject<any> = new Subject();
  public showProfileReminder: boolean;
  public showAboutMeReminder: boolean;
  public authSet = false;
  private profileChecked = false;

  constructor(public auth$: AngularFireAuth,
    private app: FirebaseApp,
    private af: AngularFireDatabase) {

    this.authState$ = auth$.authState;
    this.authState$.subscribe(user => this.user = user);

    this.email = '';

    // give an event to grab onto for changes if auth data isn't populated
    auth$.authState.subscribe(() => this.authObservable.next());

  }

  get authenticated(): boolean {
    if (typeof this.user !== 'undefined') {
      this.authSet = true;
      if (!this.profileChecked) {
        this.profileChecked = true;
        this.checkProfile();
      }
    }
    return this.user !== null;
  }

  get id(): string {
    if (typeof this.user !== 'undefined') {
      return this.authenticated ? this.user.uid : null;
    } else {
      return null;
    }
  }

  resetAuth(): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve();
    });

  }

  signInWithEmail(email, password): firebase.Promise<firebase.User> {
    return this.auth$.auth.signInWithEmailAndPassword(email, password);
  }

  registerWithEmail(email, password) {
    return this.auth$.auth.createUserWithEmailAndPassword(email, password);
  }

  signOut(): firebase.Promise<any> {
    return this.auth$.auth.signOut();
  }

  updatePassword(newPassword: string, oldPassword: string): Observable<any> {

    const subject = new Subject();

    const reAuth = this.auth$.auth.signInWithEmailAndPassword(this.email, oldPassword);

    reAuth.then((success) => {

      // tslint:disable-next-line:no-shadowed-variable
      firebase.auth().currentUser.updatePassword(newPassword).then((success) => {
        const data = {
          status: 'success',
          message: success
        };

        subject.next(data);
        subject.complete();

      }, (err) => {// error on update password

        const data = {
          status: 'error',
          message: err
        };

        subject.next(data);
        subject.complete();

      });

    }, (err) => {// error on reauth

      const data = {
        status: 'error',
        message: err
      };

      subject.next(data);
      subject.complete();

    });

    return subject;
  }

  getFileByRef(path): firebase.Promise<any> {
    return this.app.storage().ref(`userImages/${path}`).getDownloadURL();
  }

  getFile(uniquePath): firebase.Promise<any> {
    return this.app.storage().ref(`userImages/${this.id}/${uniquePath}`).getDownloadURL();
  }

  uploadFile(value, uniquePath): Observable<any> {

    const subject = new Subject();

    const file = value.target.files[0];
    const storageRef = this.app.storage().ref(`/userImages/${this.id}/${uniquePath}`);
    storageRef.put(file).then((fileData) => {
      console.log('hit');
      subject.next(fileData);
    });

    return subject;

  }

  uploadFileDirect(data, uniquePath): Observable<any> {

    console.log(data);

    const subject = new Subject();

    const blob = this.base64toBlob(data.image.substring(23));
    const storageRef = this.app.storage().ref(`/userImages/${this.id}/${uniquePath}`);
    storageRef.put(blob).then((fileData) => {
      subject.next(fileData);
    });

    return subject;

  }

  checkProfile() {
    const contact$ = this.af.object(`/contact/${this.id}`);
    contact$.first().subscribe((data: IAccountContact) => {
      console.log(data);
      if (
        !data.first || data.first.length === 0 ||
        !data.last || data.last.length === 0 ||
        !data.email || data.email.length === 0 ||
        !data.phone || data.phone.length === 0 ||
        !data.country || data.country.length === 0 ||
        !data.address || data.address.length === 0 ||
        !data.city || data.city.length === 0 ||
        !data.state || data.state.length === 0 ||
        !data.postal || data.postal.length === 0 ||
        data.timeZone === 0
      ) {
        this.showProfileReminder = true;
      } else {
        this.showProfileReminder = false;
      }

      /*if(!data.email || data.email.length == 0){
        contact$.update({email:this.user.email});
      }*/


    });


    let about$ = this.af.object(`/about/${this.id}`);

    about$.subscribe((values) => {

      if (
        !values.imageSet ||
        !values.organizerName || values.organizerName.length === 0
      ) {
        this.showAboutMeReminder = true;
      } else {
        this.showAboutMeReminder = false;
      }

    });

  }

  base64toBlob(base64Data, contentType = '') {
    const sliceSize = 1024;
    const byteCharacters = atob(base64Data);
    const bytesLength = byteCharacters.length;
    const slicesCount = Math.ceil(bytesLength / sliceSize);
    const byteArrays = new Array(slicesCount);

    for (const sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      const begin = sliceIndex * sliceSize;
      const end = Math.min(begin + sliceSize, bytesLength);

      const bytes = new Array(end - begin);
      for (const offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
  }

}
