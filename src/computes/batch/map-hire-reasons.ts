import { FlatfileRecords } from '@flatfile/hooks';
import { staticHireReasonData } from './static-hire-reason-data';
import { isNil, isNotNil } from '../../validations-plugins/common/helpers';

// const axios = require('axios');

export const mapHireReasons = async (payload: FlatfileRecords<any>) => {
  // const hireReasons: string[] = payload.records
  //   .map((r) => r.get('hireReason') as string)
  //   .filter((r) => isNotNil(r));

  // Hardcoded API response until API calls are available
  // const url = `https://hcm.show/api/v1/hire-reasons`;

  // const hireReasonsResponse = await axios.post(url, hireReasons, {
  //   headers: {
  //     'Content-Type': 'application/json',
  //     // TODO: authentication
  //   },
  // });

  // // console.log('hireReasonsResponse', hireReasonsResponse);

  // if (
  //   !(hireReasonsResponse.status >= 200 && hireReasonsResponse.status < 300)
  // ) {
  //   payload.records.forEach((record) => {
  //     record.addError(
  //       'hireReason',
  //       'Error - could not fetch hire reasons from API.'
  //     );
  //   });
  //   return;
  // }

  // interface HireReasonResult {
  //   originalString: string;
  //   id: string | undefined;
  // }
  // const hireReasonMapping = hireReasonsResponse.data as HireReasonResult[];

  // const hireReasonMapping = hireReasons.map((s) => {
  //   const [classificationName, category, reason] = s.split(' > ');

  //   return {
  //     originalString: s,
  //     id: staticHireReasonData.find(
  //       (h) =>
  //         h.classificationName === classificationName &&
  //         h.category === category &&
  //         h.reason === reason
  //     )?.id,
  //   };
  // });

  payload.records.forEach((record) => {
    // const hireReasonId = hireReasonMapping.find(
    //   (d) => d.originalString === record.get('hireReason')
    // )?.id;

    // if (hireReasonId) {
    record.set('hireReason', 'DID IT WORK');
    // } else {
    //   record.addError('hireReason', 'Could not find hire reason in API.');
    // }
  });
};
