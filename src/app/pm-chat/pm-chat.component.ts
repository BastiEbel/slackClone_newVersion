import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FileUpload } from 'src/models/file-upload.model';
import { ChatServiceService } from '../services/chat-service.service';
import { FileUploadService } from '../services/file-upload.service';
import { getDownloadURL, getStorage, ref } from '@angular/fire/storage';
import { ProfilServiceService } from '../services/profil-service.service';
import { ThreadService } from '../services/thread.service';

@Component({
  selector: 'app-pm-chat',
  templateUrl: './pm-chat.component.html',
  styleUrls: ['./pm-chat.component.scss'],
})
export class PmChatComponent implements OnInit {
  selectedFiles?: FileList;
  currentFileUpload?: FileUpload;
  percentage: number = 0;
  imgSrc: string = '';
  selectedImage: any = null;
  downloadURL: string;
  user: any = [];
  constructor(
    private uploadService: FileUploadService,
    private fileList: FileUploadService, //?????????
    public profileService: ProfilServiceService,
    public firestore: AngularFirestore,
    public chatService: ChatServiceService,
    public threadService: ThreadService,
    private deleteService: ChatServiceService
  ) {}

  ngOnInit(): void {}
  ngOnChange(): void {}
  ngAfterViewInit(): void {
    this.chatService.getPMData();
  }

  /**
   * Save Message and upload files by clicking send button, only if value isn´t empty
   *
   */
  savePM() {
    if (this.chatService.personalMessage.pmQuestion.length > 0) {
      if (this.selectedFiles) {
        this.chatService.savePMIntoFirestore().then(() => {
          this.selectedFiles = undefined;
          this.chatService.personalMessage.pmQuestion = '';
          this.downloadURL = '';
        });
      } else {
        this.chatService.savePMIntoFirestore().then(() => {
          this.chatService.personalMessage.pmQuestion = '';
          this.downloadURL = '';
        });
      }
    }
  }

  setMessagePM(value) {
    this.chatService.personalMessage.pmQuestion = value;
  }

  deletePM(i) {}

  goToThreadPM(i) {}

  /**
   * Save selected File in variable selectedFiles
   * @param event
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
}
