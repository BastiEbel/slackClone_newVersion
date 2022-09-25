import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject } from 'rxjs';
import { PersonalMessage } from 'src/models/personal-message.class';
import { ChannelService } from './channel.service';
import { ProfilServiceService } from './profil-service.service';
import { ThreadService } from './thread.service';

@Injectable({
  providedIn: 'root',
})
export class ChatServiceService {
  channel: any;
  thread: any;
  chatThread: string;
  chat: string;
  pmData: any = [];
  user: any = [];
  pmQuestions: any = [];
  downloadURL: string;
  pm: boolean = false;
  show: boolean = false;
  userUID: string;

  personalMessage = new PersonalMessage();
  public chatData$: BehaviorSubject<any> = new BehaviorSubject('');
  public chatThread$: BehaviorSubject<any> = new BehaviorSubject('');
  public pmData$: BehaviorSubject<any> = new BehaviorSubject('');

  constructor(
    private firestore: AngularFirestore,
    private profileService: ProfilServiceService,
    private channelService: ChannelService,
    private threadService: ThreadService
  ) {
    /**
     * get the current User
     *
     */
    this.profileService.currentUserProfile$.subscribe((result): any => {
      this.user = result;
      this.userUID = this.user?.uid;
    });
  }

  /**
   * save PM to the Firestore
   *
   */
  savePMIntoFirestore() {
    const currentTime = new Date().getTime();
    return this.firestore
      .collection(`pmUser/`)
      .doc(this.pmData.uID)
      .set({
        userName: this.pmData.displayName,
        uploadTime: currentTime,
        pmQuestion: this.personalMessage.pmQuestion,
        downloads: this.downloadURL || null,
        pmUser: this.user.displayName || null,
        photoURL: this.user.photoURL || null,
      });
  }

  /**
   * get value from pmData$
   *
   */
  async getPMData() {
    await this.pmData$.subscribe((dataPM) => {
      this.pmData = dataPM;

      this.firestore
        .collection(`pmUser/`)
        .valueChanges({ idField: 'messageUID' })
        .subscribe((pmMessage: any) => {
          this.pmQuestions = pmMessage;
          if (this.userUID != null) {
            for (let i = 0; i < this.pmQuestions.length; i++) {
              if (
                this.pmQuestions[0]['messageUID'] === this.pmData.uID ||
                (this.pmQuestions[0]['messageUID'] === this.userUID &&
                  this.pmQuestions[0]['pmUser'] === this.pmData.displayName)
              ) {
                this.show = true;
              } else {
                this.show = false;
              }
            }
          }
        });
    });
  }

  /* async getData() {
    let pmData = this.user.uid;
    await this.firestore
      .collection(`pmUser/${pmData}/message/`)
      .valueChanges({ idField: 'messageUID' })
      .subscribe((pmMessage: any) => {
        this.pmQuestions = pmMessage;

        for (let i = 0; i < this.pmQuestions.length; i++) {
          if (
            this.pmQuestions[i]['pmUser'] ||
            this.pmQuestions[i]['userName'] != this.user.displayName
          ) {
            this.show = false;
          } else {
            this.show = true;
          }
        }
      });
  } */

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
