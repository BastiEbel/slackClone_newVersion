import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ThreadService } from '../services/thread.service';
import { ProfilComponent } from '../profil/profil.component';
import { ProfilServiceService } from '../services/profil-service.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-slack-app',
  templateUrl: './slack-app.component.html',
  styleUrls: ['./slack-app.component.scss'],
})
export class SlackAppComponent implements OnInit, AfterViewInit {
  userId = '';
  user$ = this.profilService.currentUserProfile$;

  @ViewChild('thread') thread: MatDrawer;

  constructor(
    public authService: AuthService,
    private router: Router,
    public threadService: ThreadService,
    public profilService: ProfilServiceService,
    private route: ActivatedRoute,
    public el: ElementRef,
    public dialog: MatDialog
  ) {}

  ngAfterViewInit(): void {
    this.thread.opened = this.threadService.opened;
  }

  ngOnInit(): void {
    if (!this.authService.login) {
      this.router.navigateByUrl('/login');
    }
    this.route.paramMap.subscribe((paramMap) => {
      this.userId = paramMap.get('id');
      this.authService.currentUser$;
    });
  }

  openDialog(): void {
    this.dialog.open(ProfilComponent);
  }

  deleteDialog() {
    this.dialog.open(DeleteDialogComponent);
  }

  logOut() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
      this.authService.login = false;
    });
  }
}
