export class User {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  uID: string;
  firstName: string;
  lastName: string;
  street: string;
  zipCode: number;
  city: string;

  constructor(obj?: any) {
    this.userName = obj ? obj.userName : '';
    this.email = obj ? obj.email : '';
    this.password = obj ? obj.password : '';
    this.confirmPassword = obj ? obj.confirmPassword : '';
    this.uID = obj ? obj.uID : '';
    this.firstName = obj ? obj.firstName : '';
    this.lastName = obj ? obj.lastName : '';
    this.street = obj ? obj.street : '';
    this.zipCode = obj ? obj.zipCode : '';
    this.city = obj ? obj.city : '';
  }

  public toJSON() {
    return {
      userName: this.userName,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword,
      uID: this.uID,
      firstName: this.firstName,
      lastName: this.lastName,
      street: this.street,
      zipCode: this.zipCode,
      city: this.city,
    };
  }
}
