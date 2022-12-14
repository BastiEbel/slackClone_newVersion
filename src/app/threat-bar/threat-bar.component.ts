import { Component, OnInit } from '@angular/core';
import { FileUpload } from 'src/models/file-upload.model';
import { FileUploadService } from '../services/file-upload.service';
import { ThreadService } from '../services/thread.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ChannelService } from '../services/channel.service';
import { Message } from 'src/models/message.class';
import { getDownloadURL, getStorage, ref } from '@angular/fire/storage';
import { ProfilServiceService } from '../services/profil-service.service';
import { ChatServiceService } from '../services/chat-service.service';

@Component({
  selector: 'app-threat-bar',
  templateUrl: './threat-bar.component.html',
  styleUrls: ['./threat-bar.component.scss'],
})
export class ThreatBarComponent implements OnInit {
  thread = '';
  channel = '';
  question = new Message();
  answerMessages = [];
  downloadURL: string;
  selectedFiles?: FileList;
  currentFileUpload?: FileUpload;
  newAnswer = new Message();
  percentage = 0;
  user: any = [];
  imgSrc: string = '';
  selectedImage: any = null;

  constructor(
    private uploadService: FileUploadService,
    public threadService: ThreadService,
    public channelService: ChannelService,
    private profileService: ProfilServiceService,
    private firestore: AngularFirestore,
    private deleteService: ChatServiceService
  ) {}

  ngOnInit(): void {
    this.getThread();
    this.getUser();
  }

  ngAfterViewInit() {
    if (window.innerWidth < 600) {
      this.threadService.sideNav = true;
    }
  }

  /**
   * get info of the Thread
   *
   */
  getThread() {
    this.channelService.data$.subscribe((channelData) => {
      this.channel = channelData;
      this.threadService.data$.subscribe((threadData) => {
        this.thread = threadData;
        this.firestore
          .collection(
            `channels/${this.channel['channelId']}/messages/${this.thread['messageID']}/answers`
          )
          .valueChanges({ idField: 'messageID' })
          .subscribe((msg: any) => {
            this.answerMessages = msg;
          });
      });
    });
  }

  /**
   * function to answer in the Thread
   *
   */
  openAnswers() {
    this.threadService.data$.next({
      answer: this.answerMessages['answer'],
    });
  }

  /**
   * function to upload img
   *
   */
  async selectFile(event: any): Promise<void> {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => (this.imgSrc = e.target.result);
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
      this.selectedFiles = event.target.files;
    } else {
      this.selectedImage = null;
    }
    this.upload();
  }

  /**
   * Upload File in selectedFiles to Firestore and delete selectedFiles
   */
  upload(): void {
    const file: File | null = this.selectedFiles.item(0);
    this.downloadURL = file.name;
    if (file) {
      this.currentFileUpload = new FileUpload(file);
      this.uploadService
        .pushFileToStorage(this.currentFileUpload)
        .subscribe((percentage) => {
          this.percentage = Math.round(percentage ? percentage : 0);
          if (percentage == 100) {
            this.getFileUrl(this.downloadURL);
            setTimeout(() => {
              this.percentage = 0;
            }, 1000);
          }
        });
    }
  }

  /**
   * Show Date and Time for showing at message
   * @param {number} time uploadTime of message
   * @return {string} eg. 2021-01-16 09:41
   */
  uploadTimeToMessageTime(time) {
    const isoTime = new Date(time).toISOString();
    const date = isoTime.slice(0, 10);
    const timeString = isoTime.slice(11, 16);
    return date + ' / ' + timeString;
  }

  /**
   * Getting download Url from fileName
   * @param {string} fileName
   * @return string
   */
  getFileUrl(fileName: string): any {
    const storage = getStorage();
    getDownloadURL(ref(storage, `uploads/${fileName}`)).then((url) => {
      this.downloadURL = url;
    });
  }

  /**
   * Save Message by clicking send button
   * Only working if something is written in input field.
   */
  saveAnswer() {
    if (this.newAnswer.answers.length > 0) {
      if (this.selectedFiles) {
        this.saveAnswerToFirestore().then(() => {
          this.selectedFiles = undefined;
          this.newAnswer.answers = '';
          this.downloadURL = '';
        });
      } else {
        this.saveAnswerToFirestore().then(() => {
          this.newAnswer.answers = '';
          this.downloadURL = '';
        });
      }
    }
  }

  /**
   * save answer into firebase(db)
   *
   */
  async saveAnswerToFirestore() {
    const actualTime = new Date().getTime();
    await this.firestore
      .collection(
        `channels/${this.channel['channelId']}/messages/${this.thread['messageID']}/answers`
      )
      .doc(actualTime.toString()) // Time as DocumentId
      .set({
        uploadTime: actualTime,
        answers: this.newAnswer.answers,
        downloads: this.downloadURL || null,
        user: this.user.displayName,
        photoURL: this.user.photoURL || null,
      });
  }

  /**
   * get the current User
   *
   */
  getUser() {
    this.profileService.currentUserProfile$.subscribe((result) => {
      this.user = result;
    });
  }

  /**
   * Delete the Messages
   * @param i index of the Message
   *
   */
  deleteItem(i) {
    this.deleteService.chatThread$.next({
      threadId: this.answerMessages[i]['messageID'],
    });
    this.deleteService.deleteThread();
  }

  /**
   *
   * @param value of the input field
   *
   */
  setAnswer(value: any) {
    this.newAnswer.answers = value;
  }

  /**
   *
   * @returns to close the Thread
   *
   */
  closeThread() {
    return (this.threadService.opened = false);
  }
}
