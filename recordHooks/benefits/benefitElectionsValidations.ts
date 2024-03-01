import { formatRecordDates } from '../../common/dateFormatting';
import { roundCurrencyValues } from './roundCurrencyValues';
import { validateBooleanFields } from '../../common/validateBooleanFields';

export function benefitElectionsValidations(record) {
  if (!record || typeof record !== 'object') {
    throw new Error(
      'Invalid input. The function expects a valid record object.'
    );
  }

  try {
    formatRecordDates(record, 'benefit-elections-sheet');
  } catch (error) {
    console.log('Error occurred during date formatting:', error);
  }

  try {
    validateBooleanFields(record, 'benefit-elections-sheet');
  } catch (error) {
    console.log('An error occurred during boolean field validation:', error);
  }

  try {
    roundCurrencyValues(record, ['employerContribution']);
  } catch (error) {
    console.log(
      'An error occurred during rounding of employer contribution:',
      error
    );
  }

  // Returns the validated and possibly modified record.
  return record;
}
