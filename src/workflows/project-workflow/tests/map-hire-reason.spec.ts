import { SheetTester } from '@flatfile/configure';
import { sampleRow, sampleWorkbook } from '../../../utils/testing/samples';

import axios from 'axios';
jest.mock('axios');

describe('Workbook tests -> Map hire reason to ID ->', () => {
  const testSheet = new SheetTester(sampleWorkbook, 'Employees');

  test('if the API call fails', async () => {
    const mock = {
      status: 400,
    };

    // @ts-ignore
    axios.post.mockResolvedValue(mock);

    // Mock /employees call
    // @ts-ignore
    axios.get.mockResolvedValue({ status: 200, data: [] });

    sampleRow['hireReason'] = 'Some > Hire > Reason';

    const res = await testSheet.testMessage(sampleRow);

    const hireReason = res.find((row) => row.field === 'hireReason');
    expect(hireReason?.message).toEqual(
      'Error - could not fetch hire reasons from API.'
    );
  });

  test('if the API call succeeds', async () => {
    const hireReasonString = 'Hire Employee > New Hire > New Position';

    const mock = {
      status: 200,
      data: [
        {
          originalString: 'New Hire',
          id: 'abc123',
        },
        {
          originalString: hireReasonString,
          id: 'def456',
        },
      ],
    };

    // Mock /employees call
    // @ts-ignore
    axios.get.mockResolvedValue({ status: 200, data: [] });

    // @ts-ignore
    axios.post.mockResolvedValue(mock);

    sampleRow['hireReason'] = hireReasonString;

    const res = await testSheet.testRecord(sampleRow);
    expect(res.hireReason).toEqual('def456');
  });

  test('if the hire reason string is missing from the API call result', async () => {
    const mock = {
      status: 200,
      data: [
        {
          originalString: 'New Hire',
          id: 'abc123',
        },
        {
          originalString: 'Re-hire',
          id: 'def456',
        },
      ],
    };

    // Mock /employees call
    // @ts-ignore
    axios.get.mockResolvedValue({ status: 200, data: [] });

    // @ts-ignore
    axios.post.mockResolvedValue(mock);

    sampleRow['hireReason'] = 'invalid-string';

    const res = await testSheet.testMessage(sampleRow);

    const hireReason = res.find((r) => r.field === 'hireReason');
    expect(hireReason?.message).toEqual('Could not find hire reason in API.');
  });
});
