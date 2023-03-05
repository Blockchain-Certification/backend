import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { SendEmailAccount, IMessage } from './add-email';
import { mailer } from '../../../config';
export class MailNodeMailerProvider implements SendEmailAccount {
  private readonly transporter: Mail;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: mailer.hostName,
      port: 587,
      secure: false,
      auth: {
        user: mailer.user, // generated ethereal user
        pass: mailer.password, // generated ethereal password
      },
    });
  }
  async sendEmail(message: IMessage): Promise<void> {
    await this.transporter.sendMail({
      to: {
        name: message.to.name,
        address: message.to.email,
      },
      from: {
        name: 'VBCC-BLOCKCHAIN',
        address: mailer.user,
      },
      subject: message.subject,
      html: message.body,
    });
  }
}


