import { day, weekType } from '@prisma/client';

export type replacement = {
  groupName: string;
  day: day;
  weekType: weekType;
  items?: [
    {
      name: string;
      cab: string;
    },
  ];
};
