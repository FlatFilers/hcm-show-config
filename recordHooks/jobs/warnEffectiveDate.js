import { FlatfileRecord } from '@flatfile/hooks';
import { isNil } from '../../common/helpers';

// Define a function to warn if the 'effectiveDate' field is blank
export const warnEffectiveDate = (record) => {
  // Get the value of the 'effectiveDate' field from the record
  let effectiveDate = record.get('effectiveDate'); // Get the value of the 'effectiveDate' field from the record

  // Check if the 'effectiveDate' value is null or undefined
  if (isNil(effectiveDate)) {
    // If 'effectiveDate' is null or undefined, add a warning message to the record
    record.addWarning(
      'effectiveDate',
      `Effective Date is blank and will default to today's date in HCM Show`
    );
  }
};