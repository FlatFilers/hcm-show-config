import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

export const mockApi = () => {
  const m = new MockAdapter(axios);

  m.onPost('https://hcm.show/api/v1/hire-reasons').reply(200, [
    {
      originalString: 'New Hire',
      id: 'abc123',
    },
    {
      originalString: 'Hire Employee > New Hire > New Position',
      id: 'def456',
    },
  ]);

  m.onGet('https://hcm.show/api/v1/employees').reply(200, [
    '2000',
    '2001',
    '2002',
  ]);
};
