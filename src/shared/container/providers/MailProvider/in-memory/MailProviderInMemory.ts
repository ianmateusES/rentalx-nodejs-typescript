import { ISendMailDTO } from '../dtos/ISendMailDTO';
import { IMailProvider } from '../models/IMailProvider';

class MailProviderInMemory implements IMailProvider {
  private messages: ISendMailDTO[] = [];

  public async sendMail(messege: ISendMailDTO): Promise<void> {
    this.messages.push(messege);
  }
}

export { MailProviderInMemory };
