import { Action } from '@flatfile/configure';

export const basicAction = new Action(
  {
    slug: 'basicAction',
    label: 'Just gonna log',
    description: "Gonna log event stuff",
  },
  async (e) => {
  return console.log(e)
  }
);
