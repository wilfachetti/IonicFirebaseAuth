import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import * as auth from 'firebase/auth';
import { signOut } from 'firebase/auth';
import { IUser } from '../model/i-user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  userData: any;

  constructor(
    public angularFirestore: AngularFirestore,
    public angularFireAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone
  ) {
    this.initializer();
  }

  initializer() {
    this.angularFireAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    });
  }

  // Login in with email/password
  signIn(email, password) {
    if(this.isLoggedIn) {
      localStorage.removeItem('user');
      this.initializer();
    }

    this.angularFireAuth.signInWithEmailAndPassword(email, password).then(() => setTimeout('', 1200));

    return this.angularFireAuth.signInWithEmailAndPassword(email, password).then(() => {
      if(this.isEmailVerified) {
        this.router.navigate(['contacts']);
      } else {
        window.alert('Email is not verified');
        return false;
      }
    }).catch((error) => {
      window.alert(error.message);
    });
  }

  // Register user with email/password
  registerUser(email, password) {
    return this.angularFireAuth.createUserWithEmailAndPassword(email, password).then((result) => {
      this.ngZone.run(() => {
        this.router.navigate(['contacts']);
      });
      this.setUserData(result.user);
    })
    .catch((error) => {
      window.alert(error);
    });
  }

  // Email verification when new user register
  sendVerificationMail() {
    /*
    // first inserction
    return this.angularFireAuth.currentUser.then((user) => {
      return user.sendEmailVerification().then(() => {
        this.router.navigate(['login']);
      });
    });

    // second inserction
    return this.angularFireAuth.auth.currentUser.sendEmailVerification()
    .then(() => {
      this.router.navigate(['verify-email']);
    });
    */
    return this.angularFireAuth.currentUser.then((user) => {
      user.sendEmailVerification();
    }).then(() => {
      this.router.navigate(['verify-email']);
    });
  }

  // Recover password
  passwordRecover(passwordResetEmail) {
    return this.angularFireAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert(
          'Password reset email has been sent, please check your inbox.'
        );
      })
      .catch((error) => {
        window.alert(error);
      });
  }
  // Returns true when user is looged in
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null && user.emailVerified !== false ? true : false;
  }

  // Returns true when user's email is verified
  get isEmailVerified(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user.emailVerified !== false ? true : false;
  }

  // Sign in with Gmail
  googleAuth() {
    if(this.isLoggedIn) {
      localStorage.removeItem('user');
      this.initializer();
    }
    return this.authLogin(new auth.GoogleAuthProvider());
  }

  // Auth providers
  authLogin(provider) {
    return this.angularFireAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['contacts']);
        });
        this.setUserData(result.user);
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  // Store user in localStorage
  setUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.angularFirestore.doc('users/' + user.uid);

    const userData: IUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };

    return userRef.set(userData, {
      merge: true
    });
  }

  // Sign-out
  signOut() {
    return this.angularFireAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    });
  }
}
