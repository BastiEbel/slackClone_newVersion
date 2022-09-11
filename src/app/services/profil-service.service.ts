import { Injectable } from '@angular/core';
import {
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

  addUser(user: User): Observable<any> {
    const ref = doc(this.firestore, 'users', user.uid);
    return from(setDoc(ref, user));
  }

  updateUser(user: User): Observable<any> {
    const ref = doc(this.firestore, 'users', user.uid);
    return from(updateDoc(ref, { ...user }));
  }
}
