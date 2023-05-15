import { RecordsWithLinks } from '@flatfile/api';

import { dedupe } from '../src/locations';

describe('Locations', () => {
  it('dedupe', () => {
    const inbound: RecordsWithLinks = [
      {
        id: 'us_rc_fkdahyiVO9yaxfHSpbJszTMELojpXb6N',
        values: {
          location_ref: {
            value: '664609',
            valid: true,
            messages: [],
          },
          location_name: {
            value: 'South Christopheton',
            valid: true,
            messages: [],
          },
          location_street_address: {
            value: '1925 Barrows Views',
            valid: true,
            messages: [],
          },
          location_city: {
            value: 'Nashville-Davidson',
            valid: true,
            messages: [],
          },
          location_region: {
            value: '994',
            valid: true,
            messages: [],
          },
          location_start_date: {
            value:
              'Fri Dec 02 2022 07:20:07 GMT+0000 (Coordinated Universal Time)',
            valid: true,
            messages: [],
          },
          location_end_date: {
            value:
              'Wed Apr 17 2024 22:00:50 GMT+0000 (Coordinated Universal Time)',
            valid: true,
            messages: [],
          },
          location_type: {
            value: 'X',
            valid: true,
            messages: [],
          },
        },
      },
      {
        id: 'us_rc_uiBv91do0oeEGlrodkuknu0rn3Z6ZEJd',
        values: {
          location_ref: {
            value: '386605',
            valid: true,
            messages: [],
          },
          location_name: {
            value: 'Berniceworth',
            valid: true,
            messages: [],
          },
          location_street_address: {
            value: '2569 Jordi Knolls',
            valid: true,
            messages: [],
          },
          location_city: {
            value: 'Jefferson City',
            valid: true,
            messages: [],
          },
          location_region: {
            value: '572',
            valid: true,
            messages: [],
          },
          location_start_date: {
            value:
              'Fri Mar 03 2023 17:31:42 GMT+0000 (Coordinated Universal Time)',
            valid: true,
            messages: [],
          },
          location_end_date: {
            value:
              'Tue Aug 01 2023 16:10:33 GMT+0000 (Coordinated Universal Time)',
            valid: true,
            messages: [],
          },
          location_type: {
            value: 'B',
            valid: true,
            messages: [],
          },
        },
      },
      {
        id: 'us_rc_KPgLh5YlbpPYEcWrIvJpQIM3JbgQh5JF',
        values: {
          location_ref: {
            value: '196518',
            valid: true,
            messages: [],
          },
          location_name: {
            value: 'North Walker',
            valid: true,
            messages: [],
          },
          location_street_address: {
            value: '73792 Gottlieb Loop',
            valid: true,
            messages: [],
          },
          location_city: {
            value: 'Aloha',
            valid: true,
            messages: [],
          },
          location_region: {
            value: '451',
            valid: true,
            messages: [],
          },
          location_start_date: {
            value:
              'Tue Nov 15 2022 10:59:51 GMT+0000 (Coordinated Universal Time)',
            valid: true,
            messages: [],
          },
          location_end_date: {
            value:
              'Sun Sep 17 2023 18:00:24 GMT+0000 (Coordinated Universal Time)',
            valid: true,
            messages: [],
          },
          location_type: {
            value: 'B',
            valid: true,
            messages: [],
          },
        },
      },
      {
        id: 'us_rc_G6zEw9SM394ZHtxEmrzJWvEzZnGq2mdI',
        values: {
          location_ref: {
            value: '748955',
            valid: true,
            messages: [],
          },
          location_name: {
            value: 'Delmerstead',
            valid: true,
            messages: [],
          },
          location_street_address: {
            value: "90145 O'Hara Club",
            valid: true,
            messages: [],
          },
          location_city: {
            value: 'Doral',
            valid: true,
            messages: [],
          },
          location_region: {
            value: '494',
            valid: true,
            messages: [],
          },
          location_start_date: {
            value:
              'Fri Oct 21 2022 02:09:42 GMT+0000 (Coordinated Universal Time)',
            valid: true,
            messages: [],
          },
          location_end_date: {
            value:
              'Thu Jan 18 2024 09:13:45 GMT+0000 (Coordinated Universal Time)',
            valid: true,
            messages: [],
          },
          location_type: {
            value: 'I',
            valid: true,
            messages: [],
          },
        },
      },
      {
        id: 'us_rc_DO98ZmkXnhQLRAadwuFv89MDmOWrFPyV',
        values: {
          location_ref: {
            value: '664609',
            valid: true,
            messages: [],
          },
          location_name: {
            value: 'Eulahland',
            valid: true,
            messages: [],
          },
          location_street_address: {
            value: '6603 Bogisich Motorway',
            valid: true,
            messages: [],
          },
          location_city: {
            value: 'Worcester',
            valid: true,
            messages: [],
          },
          location_region: {
            value: '822',
            valid: true,
            messages: [],
          },
          location_start_date: {
            value:
              'Wed Dec 21 2022 00:58:30 GMT+0000 (Coordinated Universal Time)',
            valid: true,
            messages: [],
          },
          location_end_date: {
            value:
              'Fri May 05 2023 11:37:27 GMT+0000 (Coordinated Universal Time)',
            valid: true,
            messages: [],
          },
          location_type: {
            value: 'I',
            valid: true,
            messages: [],
          },
        },
      },
    ];

    const actual = dedupe(inbound);
    const expected: Array<string> = ['us_rc_fkdahyiVO9yaxfHSpbJszTMELojpXb6N'];

    expect(actual).toStrictEqual(expected);
  });
});
