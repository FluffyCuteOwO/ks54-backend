import { day } from '@prisma/client';
import * as dayjs from 'dayjs';

export const currentDay = () => {
  const curDay = dayjs().day();
  switch (curDay) {
    case 0:
      return day.Sunday;
    case 1:
      return day.Monday;
    case 2:
      return day.Tuesday;
    case 3:
      return day.Wednesday;
    case 4:
      return day.Thursday;
    case 5:
      return day.Friday;
    case 6:
      return day.Saturday;
  }
};
