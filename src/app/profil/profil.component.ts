import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { User } from 'firebase/auth';
import { concatMap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ImageUploadService } from '../services/image-upload.service';
import { ProfilServiceService } from '../services/profil-service.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss'],
})
export class ProfilComponent implements OnInit {
  user$ = this.authService.currentUser$;
  constructor(
    public dialogRef: MatDialogRef<any>,
    private imageUploadService: ImageUploadService,
    private profilService: ProfilServiceService,
    private toast: HotToastService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  uploadImage(event: any, user: User) {
    this.imageUploadService
      .uploadImage(event.target.files[0], `${user.uid}`)
      .pipe(
        this.toast.observe({
          loading: 'Image is being uploaded...',
          success: 'Image uploaded!',
          error: 'There was an error in uploading',
        }),
        concatMap((photoURL) =>
          this.authService.updateProfileData({ photoURL })
        )
      )
      .subscribe();
  }
}
