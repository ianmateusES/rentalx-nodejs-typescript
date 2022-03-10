import { container } from 'tsyringe';

import { HandlebarsMailTemplatesProvider } from './implementations/HandlebarsMailTemplateProvider';
import { IMailTemplateProvider } from './models/IMailTemplateProvider';

const providers = {
  handlebars: HandlebarsMailTemplatesProvider,
};

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  providers.handlebars,
);
