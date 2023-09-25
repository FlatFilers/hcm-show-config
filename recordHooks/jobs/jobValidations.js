import { defaultInactiveAndWarnEffectiveDate } from './defaultInactiveAndWarnEffectiveDate';
import { formatRecordDates } from '../../common/dateFormatting';
import { generateJobCode } from './generateJobCode';
import { validateBooleanFields } from '../../common/validateBooleanFields';
import { validateJobNameLength } from './validateJobNameLength';

export function jobValidations(record) {
  // Validate the input record parameter
  if (!record || typeof record !== 'object') {
    console.log('Invalid record input. Expecting a valid record object.');
    return record;
  }

  try {
    validateJobNameLength(record); // Call the new function here
  } catch (error) {
    console.log('Error occurred during job name length validation:', error);
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
    validateBooleanFields(record, 'jobs-sheet');
  } catch (error) {
    console.log('Error occurred during boolean field validation:', error);
    // Handle or rethrow the error as needed
  }

  try {
    generateJobCode(record);
  } catch (error) {
    console.log('Error occurred while generating job code:', error);
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
