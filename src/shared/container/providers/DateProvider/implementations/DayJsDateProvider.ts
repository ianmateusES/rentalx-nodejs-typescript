import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { IDateProvider } from '../models/IDateProvider';

dayjs.extend(utc);

class DayjsDateProvider implements IDateProvider {
  public checkIsBefore(start_date: Date, end_date: Date): boolean {
    return dayjs(start_date).isBefore(end_date);
  }

  public compareInDays(start_date: Date, end_date: Date): number {
    return dayjs(this.convertToUTC(end_date)).diff(
      this.convertToUTC(start_date),
      'days',
    );
  }

  public dateNow(): Date {
    return dayjs().toDate();
  }

  public addDays(days: number, reference_date: Date = null): Date {
    const date = reference_date ? dayjs(reference_date) : dayjs();
    return date.add(days, 'day').toDate();
  }

  public addHours(hours: number, reference_date: Date): Date {
    const date = reference_date ? dayjs(reference_date) : dayjs();
    return date.add(hours, 'hour').toDate();
  }

  public convertToUTC(date: Date): string {
    return dayjs(date).utc().local().format();
  }

  public compareInHours(start_date: Date, end_date: Date): number {
    return dayjs(this.convertToUTC(end_date)).diff(
      this.convertToUTC(start_date),
      'hours',
    );
  }
}

export { DayjsDateProvider };
