export interface IAddress{
  email: string;
  name: string;
}
export interface IMessage{
  to: IAddress;
  subject: string;
  body: string;
}
export interface SendEmailAccount {
  sendEmail : (email: IMessage) =>  Promise<void>;
}