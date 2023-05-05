import { FlatfileRecord } from '@flatfile/hooks';
import { isNil } from '../../common/helpers';

export const validateContactInformation = (record) => {
  //Add validation for phoneNumber or emailAddress is required for creation of Employee
  if (isNil(record.get('phoneNumber')) && isNil(record.get('emailAddress'))) {
    const message =
      'One of the following contact methods is required: Phone Number or Email Address!';
    record.addError('phoneNumber', message);
    record.addError('emailAddress', message);
  }
};
