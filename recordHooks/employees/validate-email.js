import { FlatfileRecord } from '@flatfile/hooks';
import EmailValidator from 'email-validator';

export const validateEmail = (record) => {
  if (!EmailValidator.validate(record.get('emailAddress'))) {
    record.addError(
      'emailAddress',
      "Email addresses must be in the format of 'xxx@yy.com'. Valid examples: john.doe@aol.com, jane@aol.com."
    );
  }
};
