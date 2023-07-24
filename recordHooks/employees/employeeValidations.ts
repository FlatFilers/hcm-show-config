import { vlookup } from '../../common/common';
import validateContactInformation from './validate-contact-information';
import { validateJobDates } from './validate-job-dates';
import { formatRecordDates } from '../../common/dateFormatting';
import { employeeHours } from './employee-hours';
import { concatenateNames, splitFullName } from './employeeNameProcessing';
import { checkApiForExistingWorkers } from './apiValidation';

export async function employeeValidations(record, employees) {
  // Validate the input record parameter
  if (!record || typeof record !== 'object') {
    throw new Error('Invalid record input. Expecting a valid record object.');
  }

  try {
    formatRecordDates(record, 'employees-sheet');
  } catch (error) {
    console.log('Error occurred during date formatting:', error);
    // Handle or rethrow the error as needed
  }

  // Processes names: if names are split, it concatenates them. If name is full, it splits it into components
  try {
    console.log('Processing names...');
    concatenateNames(record);
    splitFullName(record);
    console.log('Names processed successfully.');
  } catch (error) {
    console.log('Error occurred during name processing:', error);
  }

  try {
    validateContactInformation(record);
  } catch (error) {
    console.log('Error occurred during contact information validation:', error);
    // Handle or rethrow the error as needed
  }

  try {
    validateJobDates(record);
  } catch (error) {
    console.log('Error occurred during job date validation:', error);
    // Handle or rethrow the error as needed
  }

  try {
    employeeHours(record);
  } catch (error) {
    console.log('Error occurred during employee hours validation:', error);
    // Handle or rethrow the error as needed
  }

  try {
    vlookup(record, 'jobName', 'jobCode', 'jobCode');
  } catch (error) {
    console.log('Error occurred during vlookup:', error);
    // Handle or rethrow the error as needed
  }

  // Run API check for existing workers
  try {
    console.log('Checking API for existing workers...');
    await checkApiForExistingWorkers(record, employees);
    console.log('API check completed successfully.');
  } catch (error) {
    console.log('Error occurred during API check:', error);
  }

  return record;
}
