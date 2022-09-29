import { Injectable } from '@angular/core';
import {
  deleteDoc,
  doc,
  docData,
  Firestore,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { from, Observable, of, switchMap } from 'rxjs';
import { User } from 'src/models/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProfilServiceService {
  ref: any;

  /**
   * get the currentUser for the Profil
   *
   */
  get currentUserProfile$(): Observable<User | null> {
    return this.authService.currentUser$.pipe(
      switchMap((user) => {
        if (!user?.uid) {
          return of(null);
        }

        this.ref = doc(this.firestore, 'users', user?.uid);
        return docData(this.ref) as Observable<User>;
      })
    );
  }

  constructor(private firestore: Firestore, private authService: AuthService) {}

  /**
   *
   * @param user current user from the Registration
   * @returns user data to the firestore database
   */
  addUser(user: User): Observable<any> {
    const ref = doc(this.firestore, 'users', user.uid);
    return from(setDoc(ref, user));
  }

  /**
   *
   * @param user user data from the user firestore database
   * @returns update user information to database
   */
  updateUser(user: User): Observable<any> {
    const ref = doc(this.firestore, 'users', user.uid);
    return from(updateDoc(ref, { ...user }));
  }

  /**
   *
   * @returns delete user to the database and delete this one
   *
   */
  deleteDBUser() {
    return from(deleteDoc(this.ref));
  }
}
