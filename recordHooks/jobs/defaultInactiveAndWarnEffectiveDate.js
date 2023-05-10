import { FlatfileRecord } from '@flatfile/hooks';
import { isNil } from '../../common/helpers';

export const defaultInactiveAndWarnEffectiveDate = (record) => {
  try {
    let inactive = record.get('inactive');
    if (isNil(inactive)) {
      record.set('inactive', false);
      record.addInfo(
        'inactive',
        'Inactive was not provided. Field has been set to false.'
      );
    }

    let effectiveDate = record.get('effectiveDate');
    if (isNil(effectiveDate)) {
      record.addWarning(
        'effectiveDate',
        `Effective Date is blank and will default to today's date in HCM Show`
      );
    }
  } catch (err) {
    console.error(err);
    record.addError(
      'defaultInactiveAndWarnEffectiveDate',
      `An error occurred: ${err.message}`
    );
  }
};
