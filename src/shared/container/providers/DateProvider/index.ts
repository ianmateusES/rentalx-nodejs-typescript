import { container } from 'tsyringe';

import { DayjsDateProvider } from './implementations/DayJsDateProvider';
import { IDateProvider } from './models/IDateProvider';

container.registerSingleton<IDateProvider>(
  'DayjsDateProvider',
  DayjsDateProvider,
);
