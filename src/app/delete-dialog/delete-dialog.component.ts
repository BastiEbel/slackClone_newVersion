import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ProfilServiceService } from '../services/profil-service.service';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss'],
})
export class DeleteDialogComponent implements OnInit {
  user$ = this.profilService.currentUserProfile$;

  constructor(
    public dialogRef: MatDialogRef<any>,
    public authService: AuthService,
    public profilService: ProfilServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  /**
   * Delete Account
   *
   */
  async deleteUser() {
    this.dialogRef.close();
    this.authService.logout();
    this.authService.login = false;
    this.router.navigate(['/login']);
    await this.authService.deleteAcc();
    await this.profilService.deleteDBUser();
  }
}
