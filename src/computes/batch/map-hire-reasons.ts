import { FlatfileRecord, FlatfileRecords } from '@flatfile/hooks';
import { isNil } from 'lodash';
import { isNotNil, isFalsy } from '../../validations-plugins/common/helpers';

const axios = require('axios');

export const mapHireReasons = async (payload: FlatfileRecords<any>) => {
  // TODO: Where do we assume errors will happen and be handled?
  // hireReason is required, should we handle errors here or let them happen?
  const hireReasons: string[] = payload.records.map(
    (r) => r.get('hireReason') as string
  );

  const url = `https://hcm.show/api/v1/hire-reasons`;

  const hireReasonsResponse = await axios.post(url, hireReasons, {
    headers: {
      'Content-Type': 'application/json',
      // TODO: authentication
    },
  });

  if (
    !(hireReasonsResponse.status >= 200 && hireReasonsResponse.status < 300)
  ) {
    throw new Error('Error fetching hire reasons');
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

    record.set('hireReason', hireReasonId || null);
  });
};
