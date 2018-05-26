import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import 'firebase/storage';

/*  !!!PRODUCTION!!!
const firebaseConfig = {
    apiKey: "AIzaSyBCNu6lVH07e6mmI-A0-lXLnhOt4koa8-o",
    authDomain: "oevent-982b8.firebaseapp.com",
    databaseURL: "https://oevent-982b8.firebaseio.com",
    projectId: "oevent-982b8",
    storageBucket: "oevent-982b8.appspot.com",
    messagingSenderId: "327430102527"
}*/

/*staging*/
const firebaseConfig = {
    apiKey: "AIzaSyDP_CeXVzS-0p46Rb6Q2g6N0CIi8H3LCB0",
    authDomain: "oevent-staging.firebaseapp.com",
    databaseURL: "https://oevent-staging.firebaseio.com",
    projectId: "oevent-staging",
    storageBucket: "oevent-staging.appspot.com",
    messagingSenderId: "617317956709"
};

/*const firebaseConfig = {
  apiKey: "AIzaSyDP6wllvnDdN7R98gPjDJ5tMVbqa6gooHQ",
  authDomain: "oevent-1868a.firebaseapp.com",
  databaseURL: "https://oevent-1868a.firebaseio.com",
  projectId: "oevent-1868a",
  storageBucket: "oevent-1868a.appspot.com",
  messagingSenderId: "492179013999"
};*/

@NgModule({
  imports: [
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(firebaseConfig, 'Oevent')
  ]
})

export class FirebaseModule {}