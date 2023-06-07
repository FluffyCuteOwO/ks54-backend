import { day, weekType } from '@prisma/client';

export type schedule = {
  groupName: string;
  day: day;
  weekType: weekType;
  items: [
    {
      name: string;
      cab: string;
    },
  ];
};
