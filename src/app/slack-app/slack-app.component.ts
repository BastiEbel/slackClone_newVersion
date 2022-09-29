import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
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
  user$ = this.profilService.currentUserProfile$;

  @ViewChild('thread') thread: MatDrawer;

  /**
   * it is important for the responsive SideNav
   * @param event to change the size
   *
   */
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth < '600') {
      this.chatService.opened = false;
      this.chatService.sideNav = true;
      this.threadService.sideNav = true;
    }
    if (event.target.innerWidth > '600') {
      this.chatService.opened = true;
      this.chatService.sideNav = false;
      this.threadService.sideNav = false;
    }
  }

  constructor(
    public authService: AuthService,
    private router: Router,
    public threadService: ThreadService,
    public profilService: ProfilServiceService,
    public chatService: ChatServiceService,
    public el: ElementRef,
    public dialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    this.thread.opened = this.threadService.opened;
    if (window.innerWidth < 600 && this.chatService.opened) {
      this.chatService.opened = false;
    }

    this.changeDetectorRef.detectChanges();
    return (
      this.chatService.opened,
      this.chatService.sideNav,
      this.threadService.sideNav
    );
  }

  ngOnInit(): void {
    if (!this.authService.login) {
      this.router.navigate(['/login']);
    }
  }

  /**
   * open the Dialog for the Profil Component
   *
   */
  openDialog(): void {
    this.dialog.open(ProfilComponent);
  }

  /**
   *
   * @returns the boolean for the responsive SideNav
   *
   */
  openSidebar() {
    return (this.chatService.opened = true), this.chatService.sideNav;
  }

  /**
   * open the dialog for the question want you delete the User.
   *
   */
  deleteDialog() {
    this.dialog.open(DeleteDialogComponent);
  }

  /**
   * this is to logout the User
   *
   */
  logOut() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.authService.login = false;
  }
}
