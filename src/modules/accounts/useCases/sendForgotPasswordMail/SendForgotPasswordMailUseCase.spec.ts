import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { UserTokensRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UserTokensRepositoryInMemory';
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayJsDateProvider';
import { MailProviderInMemory } from '@shared/container/providers/MailProvider/in-memory/MailProviderInMemory';
import { AppError } from '@shared/errors/AppError';

import { SendForgotPasswordMailUseCase } from './SendForgotPasswordMailUseCase';

let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let userTokensRepositoryInMemory: UserTokensRepositoryInMemory;
let mailProvider: MailProviderInMemory;

describe('Send Forgot Mail', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    userTokensRepositoryInMemory = new UserTokensRepositoryInMemory();
    mailProvider = new MailProviderInMemory();

    sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
      usersRepositoryInMemory,
      userTokensRepositoryInMemory,
      dateProvider,
      mailProvider,
    );
  });

  it('should be able to send a forgot password mail to user', async () => {
    const sendMail = spyOn(mailProvider, 'sendMail');

    await usersRepositoryInMemory.create({
      driver_license: '664168',
      email: 'avzonbop@ospo.pr',
      username: 'avzonbop',
      name: 'Blanche Curry',
      password: '1234',
    });

    await sendForgotPasswordMailUseCase.execute('avzonbop@ospo.pr');

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to send an email if user does not exists', async () => {
    await expect(
      sendForgotPasswordMailUseCase.execute('ka@uj.gr'),
    ).rejects.toEqual(new AppError('User does not exists!'));
  });

  it('should be able to create an users token', async () => {
    const generateTokenMail = spyOn(userTokensRepositoryInMemory, 'create');

    usersRepositoryInMemory.create({
      driver_license: '787330',
      email: 'abome@regrog.ee',
      username: 'abome',
      name: 'Leon Perkins',
      password: '1234',
    });

    await sendForgotPasswordMailUseCase.execute('abome@regrog.ee');

    expect(generateTokenMail).toBeCalled();
  });
});
