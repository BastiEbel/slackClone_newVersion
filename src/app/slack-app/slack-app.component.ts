import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
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
import { ChatServiceService } from '../services/chat-service.service';

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
    public chatService: ChatServiceService,
    public el: ElementRef,
    public dialog: MatDialog
  ) {}

  ngAfterViewInit(): void {
    this.thread.opened = this.threadService.opened;
  }

  ngOnInit(): void {
    if (!this.authService.login) {
      this.router.navigate(['/login']);
    }
  }

  openDialog(): void {
    this.dialog.open(ProfilComponent);
  }

  deleteDialog() {
    this.dialog.open(DeleteDialogComponent);
  }

  logOut() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.authService.login = false;
  }
}
