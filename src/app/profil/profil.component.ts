import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';

import { concatMap } from 'rxjs';
import { ImageUploadService } from '../services/image-upload.service';
import { ProfilServiceService } from '../services/profil-service.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { User } from 'src/models/user';

@UntilDestroy()
@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.scss'],
})
export class ProfilComponent implements OnInit {
  user$ = this.profilService.currentUserProfile$;
  users: any = [];
  guest: boolean = false;

  profileForm = new FormGroup({
    uid: new FormControl(''),
    displayName: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    street: new FormControl(''),
    zipCode: new FormControl(''),
    city: new FormControl(''),
  });
  constructor(
    public dialogRef: MatDialogRef<any>,
    private imageUploadService: ImageUploadService,
    private profilService: ProfilServiceService,
    private toast: HotToastService
  ) {}

  ngOnInit(): void {
    this.profilService.currentUserProfile$
      .pipe(untilDestroyed(this))
      .subscribe((user) => {
        this.profileForm.patchValue({ ...user });
        this.users = user;
        if (this.users.displayName === 'Guest') {
          this.guest = true;
        } else {
          this.guest = false;
        }
      });
  }

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
          this.profilService.updateUser({ uid: user.uid, photoURL })
        )
      )
      .subscribe();
  }

  saveProfile() {
    const profileData = this.profileForm.value;
    this.profilService
      .updateUser(profileData)
      .pipe(
        this.toast.observe({
          loading: 'Updating data...',
          success: 'Data has been updated',
          error: 'There was an error in updating the data',
        })
      )
      .subscribe(() => {
        this.dialogRef.close();
      });
  }
}
