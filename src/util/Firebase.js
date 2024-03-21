import * as firebase from "firebase";
import * as firestore from "firebase/firestore";

export class Firebase {
  constructor() {
    this.init();
  }

  init() {
    if (!window._initializedFirebase) {
      firebase.initializeApp({
        // apiKey: "AIzaSyCxQ0lj_mDPaoO0BwiD6fmamqmczzGWVlY",
        // authDomain: "whatsapp-clone-a7181.firebaseapp.com",
        // projectId: "whatsapp-clone-a7181",
        // storageBucket: "gs://whatsapp-clone-a7181.appspot.com/",

        apiKey: "AIzaSyBV9RS4oWa-MFWg7A24uB97xaD_lF3Hfq0",
        authDomain: "clone-whatsapp-saulo.firebaseapp.com",
        projectId: "clone-whatsapp-saulo",
        storageBucket: "clone-whatsapp-saulo.appspot.com",
        // messagingSenderId: "44005206388",
        // appId: "1:44005206388:web:3ea167c27296b00a906421",
      });

      firebase.firestore().settings({
        timestampsInSnapshots: true,
      });

      window._initializedFirebase = true;
    }
  }

  initAuth() {
    return new Promise((resolve, reject) => {
      let provider = new firebase.auth.GoogleAuthProvider();

      firebase
        .auth()
        .signInWithPopup(provider)
        .then(function (result) {
          let token = result.credential.accessToken;
          let user = result.user;

          resolve(user, token);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  static db() {
    return firebase.firestore();
  }

  static hd() {
    return firebase.storage();
  }
}
