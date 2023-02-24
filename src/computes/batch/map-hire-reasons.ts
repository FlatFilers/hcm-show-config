import { FlatfileRecords } from '@flatfile/hooks';
import { post } from '../../utils/fetch';

// const axios = require('axios');

export const mapHireReasons = async (payload: FlatfileRecords<any>) => {
  const hireReasons: string[] = payload.records.map(
    (r) => r.get('hireReason') as string
  );

  const url = `https://hcm.show/api/v1/hire-reasons`;

  const hireReasonsResponse = await post({
    url,
    body: hireReasons,
    token: 'TODO',
  });

  // console.log('hireReasonsResponse', hireReasonsResponse);

  if (
    !(hireReasonsResponse.status >= 200 && hireReasonsResponse.status < 300)
  ) {
    payload.records.forEach((record) => {
      record.addError(
        'hireReason',
        'Error - could not fetch hire reasons from API.'
      );
    });
    return;
  }

  interface HireReasonResult {
    originalString: string;
    id: string | undefined;
  }
  const hireReasonMapping = hireReasonsResponse.data as HireReasonResult[];

  payload.records.forEach((record) => {
    const hireReasonId = hireReasonMapping.find(
      (d) => d.originalString === record.get('hireReason')
    )?.id;

    if (hireReasonId) {
      record.set('hireReason', hireReasonId);
    } else {
      record.addError('hireReason', 'Could not find hire reason in API.');
    }
  });
};
