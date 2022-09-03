import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/models/user.class';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProfilServiceService {
  loading = false;
  user = new User();
  userId: string = '';
  public profilData$: BehaviorSubject<any> = new BehaviorSubject('');
  users;

  constructor(
    private firestore: AngularFirestore,
    public authService: AuthService
  ) {}

  saveUserService() {
    this.loading = true;
    console.log(this.users);

    /* if (this.users) {
      this.firestore
        .collection('users')
        .doc(this.users)
        .update(this.user.toJSON())
        .then(() => {
          this.loading = false;
        });
    } */
  }
}
