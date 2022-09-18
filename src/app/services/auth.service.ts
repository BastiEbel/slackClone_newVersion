import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  authState,
} from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { concatMap, from, Observable, of } from 'rxjs';
import { User } from 'src/models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  login = true; //TODO auf false setzen bevor ich deploy
  currentUser$ = authState(this._auth);

  constructor(
    public _auth: Auth,
    public router: Router,
    public firestore: AngularFirestore
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

  deleteAcc() {
    const user = this._auth.currentUser;
    return user.delete();
  }

  logout() {
    return from(this._auth.signOut());
  }
}
