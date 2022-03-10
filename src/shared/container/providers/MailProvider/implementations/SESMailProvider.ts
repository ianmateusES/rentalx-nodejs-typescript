import { SES } from 'aws-sdk';
import nodemailer, { Transporter } from 'nodemailer';
import { injectable, inject } from 'tsyringe';

import mailConfig from '@config/mail';

import { IMailTemplateProvider } from '../../MailTemplateProvider/models/IMailTemplateProvider';
import { ISendMailDTO } from '../dtos/ISendMailDTO';
import { IMailProvider } from '../models/IMailProvider';

@injectable()
class SESMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    this.client = nodemailer.createTransport({
      SES: new SES({
        apiVersion: '2010-12-01',
        region: mailConfig.config.aws.region,
      }),
    });
  }

  public async sendMail({
    from,
    to,
    subject,
    templateData,
  }: ISendMailDTO): Promise<void> {
    const { email, name } = mailConfig.defaults.from;

    await this.client.sendMail({
      from: {
        name: from?.name || name,
        address: from?.email || email,
      },
      to: to.email,
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    });
  }
}

export { SESMailProvider };
