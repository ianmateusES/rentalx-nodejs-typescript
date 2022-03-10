// import { sign } from 'jsonwebtoken';
import { resolve } from 'path';
import { inject, injectable } from 'tsyringe';
import { v4 as uuidV4 } from 'uuid';

// import authConfig from '@config/auth';
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import { IUserTokensRepository } from '@modules/accounts/repositories/IUserTokensRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/models/IDateProvider';
import { IMailProvider } from '@shared/container/providers/MailProvider/models/IMailProvider';
import { AppError } from '@shared/errors/AppError';

@injectable()
class SendForgotPasswordMailUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,

    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,

    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    const forgotPasswordTemplate = resolve(
      __dirname,
      '..',
      '..',
      'views',
      'emails',
      'forgotPassword.hbs',
    );

    if (!user) {
      throw new AppError('User does not exists!');
    }

    const refresh_token = uuidV4();

    // const { secret_refresh_token } = authConfig.jwt;
    // const refresh_token = sign(
    //   { username: user.username },
    //   secret_refresh_token,
    //   {
    //     subject: user.id,
    //     expiresIn: '3h',
    //   },
    // );

    const expires_date = this.dateProvider.addHours(3);

    await this.userTokensRepository.create({
      refresh_token,
      user_id: user.id,
      expires_date,
    });

    const variables = {
      name: user.name,
      link: `${
        process.env.FORGOT_MAIL_URL || 'http://localhost:3333'
      }/password/reset?token=${refresh_token}`,
    };

    await this.mailProvider.sendMail({
      to: {
        name: user.name,
        email: user.email,
      },
      subject: 'Recuperação de Senha',
      templateData: {
        file: forgotPasswordTemplate,
        variables,
      },
    });
  }
}

export { SendForgotPasswordMailUseCase };
