import { User } from './user';

export class PersonalMessage {
  user: User;
  photoURL: string;
  pmQuestion: string;
  pmAnswers: string;

  constructor(obj?: any) {
    this.user = obj ? obj.user : '';
    this.photoURL = obj ? obj.photoURL : '';
    this.pmQuestion = obj ? obj.pmQuestion : '';
    this.pmAnswers = obj ? obj.pmAnswers : '';
  }

  public toJSON() {
    return {
      user: this.user,
      photoURL: this.photoURL,
      pmQuestion: this.pmQuestion,
      pmAnswers: this.pmAnswers,
    };
  }
}
