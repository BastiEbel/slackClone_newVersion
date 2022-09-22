import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject } from 'rxjs';
import { ChannelService } from './channel.service';
import { ThreadService } from './thread.service';

@Injectable({
  providedIn: 'root',
})
export class ChatServiceService {
  channel: any;
  thread: any;
  chatThread: string;
  chat: string;
  pm: boolean = false;
  public chatData$: BehaviorSubject<any> = new BehaviorSubject('');
  public chatThread$: BehaviorSubject<any> = new BehaviorSubject('');
  public pmData$: BehaviorSubject<any> = new BehaviorSubject('');

  constructor(
    private firestore: AngularFirestore,
    private channelService: ChannelService,
    private threadService: ThreadService
  ) {}

  /**
   * function to delete Messages
   *
   */

  deleteChat(): void {
    this.channelService.data$.subscribe((data) => {
      this.channel = data;
      this.chatData$.subscribe((chatData) => {
        this.chat = chatData;
        this.firestore
          .collection(`channels/${this.channel['channelId']}/messages`)
          .doc(this.chat['messageID']['messageId'])
          .delete();
      });
    });
  }

  deleteThread(): void {
    this.channelService.data$.subscribe((data) => {
      this.channel = data;
      this.threadService.data$.subscribe((threadData) => {
        this.thread = threadData;
        this.chatThread$.subscribe((threadMsg) => {
          this.chatThread = threadMsg;
          this.firestore
            .collection(
              `channels/${this.channel['channelId']}/messages/${this.thread['messageID']}/answers/`
            )
            .doc(this.chatThread['threadId'])
            .delete();
        });
      });
    });
  }
}
