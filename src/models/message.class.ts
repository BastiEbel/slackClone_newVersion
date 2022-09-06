import { Channel } from './channel.class';
import { User } from './user';

export class Message {
  channel: Channel;
  user: User;
  photoURL: string;
  question: string;
  answers: string;

  constructor(obj?: any) {
    this.channel = obj ? obj.channel : '';
    this.user = obj ? obj.user : '';
    this.photoURL = obj ? obj.photoURL : '';
    this.question = obj ? obj.question : '';
    this.answers = obj ? obj.answers : '';
  }

  public toJSON() {
    return {
      channel: this.channel,
      user: this.user,
      photoURL: this.photoURL,
      question: this.question,
      answers: this.answers,
    };
  }
}
