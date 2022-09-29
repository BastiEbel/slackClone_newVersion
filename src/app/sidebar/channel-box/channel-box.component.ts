import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { DialogAddChannelComponent } from 'src/app/dialog-add-channel/dialog-add-channel.component';
import { Channel } from 'src/models/channel.class';
import { MatDialog } from '@angular/material/dialog';
import { ChannelService } from 'src/app/services/channel.service';
import { ThreadService } from 'src/app/services/thread.service';
import { ChatServiceService } from 'src/app/services/chat-service.service';

@Component({
  selector: 'app-channel-box',
  templateUrl: './channel-box.component.html',
  styleUrls: ['./channel-box.component.scss'],
})
export class ChannelBoxComponent implements OnInit {
  channel = new Channel();
  dropdown = true;
  allChannels = [];

  constructor(
    private firestore: AngularFirestore,
    public dialog: MatDialog,
    public channelService: ChannelService,
    public threadService: ThreadService,
    public chatService: ChatServiceService
  ) {}

  async ngOnInit() {
    await this.firestore
      .collection('channels')
      .valueChanges({ idField: 'customIdChannel' })
      .subscribe((changes: any) => {
        this.allChannels = changes;
      });
  }

  /**
   * open dialog to add Channel
   *
   */
  openDialog() {
    this.dialog.open(DialogAddChannelComponent);
  }

  /**
   *
   * @param i channel id
   * @returns boolean for responsive Navbar
   */
  openChannel(i) {
    this.chatService.pm = false;
    this.channelService.data$.next({
      channelTitle: this.allChannels[i]['title'],
      channelId: this.allChannels[i]['customIdChannel'],
    });

    return (
      (this.threadService.opened = false), (this.chatService.opened = false)
    );
  }

  seeDropdown() {
    this.dropdown = !this.dropdown;
  }
}
