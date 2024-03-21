import * as firebase from "firebase";
import * as firestore from "firebase/firestore";

export class Firebase {
  constructor() {
    this.init();
  }

  init() {
    if (!window._initializedFirebase) {
      firebase.initializeApp({
        // usas crendencias do firebase
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
