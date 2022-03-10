import nodemailer, { Transporter } from 'nodemailer';
import { injectable, inject } from 'tsyringe';

import mailConfig from '@config/mail';

import { IMailTemplateProvider } from '../../MailTemplateProvider/models/IMailTemplateProvider';
import { ISendMailDTO } from '../dtos/ISendMailDTO';
import { IMailProvider } from '../models/IMailProvider';

@injectable()
class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    // nodemailer
    //   .createTestAccount()
    //   .then(account => {
    //     const transporter = nodemailer.createTransport({
    //       host: account.smtp.host,
    //       port: account.smtp.port,
    //       secure: account.smtp.secure,
    //       auth: {
    //         user: account.user,
    //         pass: account.pass,
    //       },
    //     });
    //     this.client = transporter;
    //   })
    //   .catch(err => console.error(err));
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: mailConfig.defaults.from.email,
        pass: mailConfig.defaults.from.password,
      },
    });

    this.client = transporter;
  }

  public async sendMail({
    from,
    to,
    subject,
    templateData,
  }: ISendMailDTO): Promise<void> {
    const { email, name } = mailConfig.defaults.from;

    const message = await this.client.sendMail({
      from: {
        name: from?.name || name,
        address: from?.email || email,
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    });

    console.log('Message sent: %s', message.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }
}

export { EtherealMailProvider };
