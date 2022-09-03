import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ProfilServiceService } from '../services/profil-service.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss'],
})
export class ProfilComponent implements OnInit {
  userId: string = '';
  constructor(
    public dialogRef: MatDialogRef<any>,
    public profilService: ProfilServiceService,
    public firestore: AngularFirestore,
    private route: ActivatedRoute,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    /* this.authService.getUser(this.userId); */
    this.userId = this.profilService.users;
    console.log(this.userId);
  }

  saveUser() {
    this.profilService.saveUserService();
    this.dialogRef.close();
  }
}
