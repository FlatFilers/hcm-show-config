import { formatRecordDates } from '../../common/dateFormatting';
import { validateNumberFields } from '../../common/validateNumberFields';
import { roundEmployerContribution } from './roundEmployerContribution';

export function employeeValidations(record) {
  // Validate the input record parameter
  if (!record || typeof record !== 'object') {
    throw new Error('Invalid record input. Expecting a valid record object.');
  }

  try {
    formatRecordDates(record, 'benefit-elections-sheet');
  } catch (error) {
    console.log('Error occurred during date formatting:', error);
    // Handle or rethrow the error as needed
  }

  try {
    validateNumberFields(record, 'benefit-elections-sheet');
  } catch (error) {
    console.log('Error occurred during number field validation:', error);
    // Handle or rethrow the error as needed
  }

  try {
    roundEmployerContribution(record, 'benefit-elections-sheet');
  } catch (error) {
    console.log(
      'Error occurred during rounding employer contribution validation:',
      error
    );
    // Handle or rethrow the error as needed
  }

  return record;
}
