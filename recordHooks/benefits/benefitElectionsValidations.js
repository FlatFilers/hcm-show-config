import { roundEmployerContribution } from './roundEmployerContribution';

export function employeeValidations(record) {
  // Validate the input record parameter
  if (!record || typeof record !== 'object') {
    throw new Error('Invalid record input. Expecting a valid record object.');
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
