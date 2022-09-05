import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ProfilServiceService } from 'src/app/services/profil-service.service';
import { User } from 'src/models/user';

@Component({
  selector: 'app-user-box',
  templateUrl: './user-box.component.html',
  styleUrls: ['./user-box.component.scss'],
})
export class UserBoxComponent implements OnInit {
  user = this.profilService.currentUserProfile$;
  dropdown = true;
  allUsers = [];

  constructor(
    private firestore: AngularFirestore,
    public authService: AuthService,
    public profilService: ProfilServiceService
  ) {}

  ngOnInit(): void {
    this.firestore
      .collection('users')
      .valueChanges({ idField: 'customIdName' })
      .subscribe((changes: any) => {
        this.allUsers = changes;
      });

    /* this.authService.currentUser$
      .pipe(map((t) => t.displayName))
      .subscribe((names) => (this.allUsers = names)); */
  }

  openUser(i) {
    console.log('User ID is ', this.allUsers[i]['customIdName']);
  }

  seeDropdown() {
    this.dropdown = !this.dropdown;
  }
}
