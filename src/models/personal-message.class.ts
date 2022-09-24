import { User } from './user';

export class PersonalMessage {
  uid: string;
  displayName: string;
  user: User;
  photoURL: string;
  pmQuestion: string;
  pmAnswers: string;

  constructor(obj?: any) {
    this.uid = obj ? obj.uid : '';
    this.displayName = obj ? obj.displayName : '';
    this.user = obj ? obj.user : '';
    this.photoURL = obj ? obj.photoURL : '';
    this.pmQuestion = obj ? obj.pmQuestion : '';
    this.pmAnswers = obj ? obj.pmAnswers : '';
  }

  public toJSON() {
    return {
      uid: this.uid,
      displayName: this.displayName,
      user: this.user,
      photoURL: this.photoURL,
      pmQuestion: this.pmQuestion,
      pmAnswers: this.pmAnswers,
    };
  }
}
