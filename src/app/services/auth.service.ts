import { Injectable } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { from, Observable, switchMap } from 'rxjs';
import { User } from 'src/models/user.class';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //user = new User();
  message: string = 'Login';
  guest: string = 'Guest';
  login = true; //TODO auf false setzen bevor ich deploy
  currentUser$ = authState(this._auth);

  constructor(
    public _auth: Auth,
    public router: Router,
    public firestore: AngularFirestore,
    public msg: MatSnackBar,
    public auth: AngularFireAuth,
    private toast: HotToastService
  ) {}

  /**
   *
   * login function
   * @param userNames parameter for the username
   * @param password parameter for the password
   */
  signInUser(email: string, password: string): Observable<any> {
    return from(signInWithEmailAndPassword(this._auth, email, password));
    /* this.firestore
      .collection('users')
      .valueChanges({ idField: 'id' }) */
    /* .subscribe((result) => {
        for (let i = 0; i < result.length; i++) {
          try {
            if (
              result[i]['userName'] === userNames &&
              result[i]['password'] === password
            ) {
              this.login = true;
              this.message = 'Logout';
              this.router.navigateByUrl(`/slack/${result[i]['id']}`);
            } else {
              this.msg.open(
                'User not found! Register please or Enter right Name or Password',
                'Close'
              );
            }
          } catch (err) {
            if (err) {
              this.msg.open(
                'User not found! Register please or Enter right Name or Password',
                'Close'
              );
            }
          }
        }
      }); */
  }

  /**
   *
   * @param email for the email address
   * @param password for the password
   * @returns that will be return
   */
  signUp(email: string, password: string, name: string) {
    return from(
      createUserWithEmailAndPassword(this._auth, email, password)
    ).pipe(switchMap(({ user }) => updateProfile(user, { displayName: name })));
  }

  logout() {
    return from(this._auth.signOut());
  }

  /**
   * user can login as a guest
   *
   */
  guestLogin() {
    this.firestore
      .collection('users')
      .valueChanges({ idField: 'id' })
      .subscribe((result) => {
        for (let i = 0; i < result.length; i++) {
          if (result[i]['userName'] == this.guest) {
            this.login = true;
            this.message = 'Logout';
            this.router.navigateByUrl(`/slack/${result[i]['id']}`);
          }
        }
      });
  }

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
          this.user = new User(user);
          console.log(this.user);
        });
    }
  } */
}
