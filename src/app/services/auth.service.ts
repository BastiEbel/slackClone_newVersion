import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  authState,
} from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { concatMap, from, Observable, of } from 'rxjs';
import { User } from 'src/models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  message: string = 'Login';
  guest: string = 'Guest';
  login = true; //TODO auf false setzen bevor ich deploy
  currentUser$ = authState(this._auth);

  constructor(
    public _auth: Auth,
    public router: Router,
    public firestore: AngularFirestore,
    public msg: MatSnackBar
  ) {}

  /**
   *
   * login function
   * @param email parameter for the email
   * @param password parameter for the password
   */
  signInUser(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this._auth, email, password));
  }

  /**
   *
   * @param email for the email address
   * @param password for the password
   * @returns that will be return
   */
  signUp(email: string, password: string) {
    return from(createUserWithEmailAndPassword(this._auth, email, password));
  }

  updateProfileData(profileData: Partial<User>): Observable<any> {
    const user = this._auth.currentUser;
    return of(user).pipe(
      concatMap((user) => {
        if (!user) throw new Error('Not Authenticated');
        return updateProfile(user, profileData);
      })
    );
  }

  logout() {
    return from(this._auth.signOut());
  }

  /**
   * user can login as a guest
   *
   */
  /* guestLogin() {
    this.firestore
      .collection('users')
      .valueChanges({ idField: 'id' })
      .subscribe((result) => {
        for (let i = 0; i < result.length; i++) {
          if (result[i]['name'] == this.guest) {
            this.login = true;
            this.message = 'Logout';
            this.router.navigateByUrl(`/slack/${result[i]['id']}`);
          }
        }
      });
  } */

  /**
   *
   * @param userId userId for the Slack Component you can show the username
   */
  /* getUser(userId) {
    if (userId) {
      this.firestore
        .collection('users')
        .doc(userId)
        .valueChanges()
        .subscribe((user: any) => {
          this.users = new User(user);
        });
    }
  } */
}
