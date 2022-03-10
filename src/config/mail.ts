interface IMailConfig {
  driver: 'ethereal' | 'ses';

  config: {
    aws: {
      region: string;
    };
  };

  defaults: {
    from: {
      email: string;
      password?: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',

  config: {
    aws: {
      region: process.env.AWS_REGION_MAIL,
    },
  },

  defaults: {
    from: {
      email: process.env.EMAIL || 'equipe@rentx.com.br',
      password: process.env.GMAIL_PASSWORD,
      name: 'Equipe Rentx',
    },
  },
} as IMailConfig;
