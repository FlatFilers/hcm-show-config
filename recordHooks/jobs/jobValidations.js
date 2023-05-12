import { defaultInactiveAndWarnEffectiveDate } from './defaultInactiveAndWarnEffectiveDate';
import { formatRecordDates } from '../../common/dateFormatting';

export function jobValidations(record) {
  // Validate the input record parameter
  if (!record || typeof record !== 'object') {
    console.log('Invalid record input. Expecting a valid record object.');
    return record;
  }

  try {
    defaultInactiveAndWarnEffectiveDate(record);
  } catch (error) {
    console.log(
      'Error occurred during defaulting inactive and warning effective date:',
      error
    );
    // Handle or rethrow the error as needed
  }

  try {
    formatRecordDates(record, 'jobs-sheet');
  } catch (error) {
    console.log('Error occurred during date formatting:', error);
    // Handle or rethrow the error as needed
  }

  return record;
}
