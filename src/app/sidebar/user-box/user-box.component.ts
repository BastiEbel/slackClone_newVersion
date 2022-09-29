import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { ChatServiceService } from 'src/app/services/chat-service.service';
import { ProfilServiceService } from 'src/app/services/profil-service.service';
import { ThreadService } from 'src/app/services/thread.service';

@Component({
  selector: 'app-user-box',
  templateUrl: './user-box.component.html',
  styleUrls: ['./user-box.component.scss'],
})
export class UserBoxComponent implements OnInit {
  user$ = this.profilService.currentUserProfile$;
  dropdown = true;
  allUsers = [];

  constructor(
    private firestore: AngularFirestore,
    public authService: AuthService,
    public profilService: ProfilServiceService,
    public chatService: ChatServiceService,
    public threadService: ThreadService
  ) {}

  ngOnInit(): void {
    this.firestore
      .collection('users')
      .valueChanges({ idField: 'customIdName' })
      .subscribe((changes: any) => {
        this.allUsers = changes;
      });
  }

  /**
   * this function open the User area for Personal Message
   * @param i is the number of the user
   * @returns for responsive SideNav
   */
  openUser(i) {
    this.chatService.pm = true;
    this.chatService.pmData$.next({
      photoURL: this.allUsers[i]['photoURL'],
      displayName: this.allUsers[i]['displayName'],
      uID: this.allUsers[i]['uid'],
    });
    return (
      (this.threadService.opened = false), (this.chatService.opened = false)
    );
  }

  /**
   * switch on and off the user box
   *
   */
  seeDropdown() {
    this.dropdown = !this.dropdown;
  }
}
