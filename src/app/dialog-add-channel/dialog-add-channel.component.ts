import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialogRef } from '@angular/material/dialog';
import { Channel } from 'src/models/channel.class';

@Component({
  selector: 'app-dialog-add-channel',
  templateUrl: './dialog-add-channel.component.html',
  styleUrls: ['./dialog-add-channel.component.scss'],
})
export class DialogAddChannelComponent implements OnInit {
  channel = new Channel();

  constructor(
    private firestore: AngularFirestore,
    public dialogRef: MatDialogRef<DialogAddChannelComponent>
  ) {}

  ngOnInit(): void {}

  saveChannel() {
    this.firestore
      .collection('channels')
      .add(this.channel.toJSON())
      .then(() => {
        this.dialogRef.close();
      });
  }
}
