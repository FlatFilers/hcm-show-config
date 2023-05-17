import { FlatfileRecord } from '@flatfile/hooks';
import { isNil } from '../../common/helpers';

export const generateJobCode = (record) => {
  try {
    let jobCode = record.get('jobCode');
    let jobName = record.get('jobName');

    if (isNil(jobCode) && !isNil(jobName)) {
      // Generate job code based on job name
      jobCode = jobName.replace(/[,\s-]+/g, '_').replace(/&/g, 'and');

      record.set('jobCode', jobCode);
      record.addInfo(
        'jobCode',
        'Job Code was not provided, this has been automatically generated for use in HCM Show'
      );
    }
  } catch (err) {
    console.log(err);
    record.addError('jobCode', `An error occurred: ${err.message}`);
  }
};
