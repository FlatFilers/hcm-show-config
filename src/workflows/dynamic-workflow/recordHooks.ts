// Import required dependencies
import { FlatfileRecord } from '@flatfile/hooks'; // Import FlatfileRecord from the '@flatfile/hooks' library
import moment from 'moment'; // Import moment.js library for date formatting

// Define the function and its input parameter
export default function recordHooks(record: FlatfileRecord) {
  // Define an array of fields that need to be formatted as dates
  const dateFields = ['coverageStartDate'];

  // Define the name of the field that needs to be rounded to 2 decimal places
  const employerContribution = 'employerContribution';

  // Define a function to format date strings
  function formatDate(dateString: string): string {
    // Define an array of accepted date formats for moment.js
    const momentFormats = [
      'YYYY-MM-DD',
      'MM/DD/YYYY',
      'M/D/YYYY',
      'YYYY/M/D',
      'D/M/YYYY',
      'YYYY/M/DD',
      'MM/DD/YY',
      'M/D/YY',
      'M/DD/YYYY',
      'M/DD/YY',
      'MM/D/YYYY',
      'MM/D/YY',
      'DD/MM/YYYY',
      'D/MM/YYYY',
      'DD/M/YYYY',
      'D/M/YYYY',
      'YYYY-MM-D',
      'YYYY-M-DD',
      'YY-MM-DD',
      'DD-M-YYYY',
      'D-M-YYYY',
      'DD-MM-YY',
      'D-MM-YY',
      'DD/M/YY',
      'D/M/YY',
      'DD/MM/YY',
      'D/MM/YY',
      'MM/DD',
      'M/DD',
      'MM/D',
      'M/D',
      'DD/MM',
      'D/MM',
      'MM-DD',
      'M-DD',
      'DD-M',
      'D-M',
      'MMddyyyy',
      'ddMMyyyy',
    ];

    // Loop through the accepted date formats and try to format the input date string
    for (const format of momentFormats) {
      const momentDate = moment(dateString, format, true);

      // If the formatted date is valid, return it in the 'YYYY-MM-DD' format
      if (momentDate.isValid()) {
        return momentDate.format('YYYY-MM-DD');
      }
    }

    // If none of the accepted date formats work, return 'Invalid Date'
    return 'Invalid Date';
  }

  // Loop through each field in dateFields array
  dateFields.forEach((dateField) => {
    // Get the input value for the field
    const inputDate = record.get(dateField);

    // Check if the input value is a non-empty string
    if (typeof inputDate === 'string' && inputDate.trim().length > 0) {
      // Format the input date using the formatDate function
      const formattedDate = formatDate(inputDate.trim());

      // If the formatted date is 'Invalid Date', log an error and add an error message to the record
      if (formattedDate === 'Invalid Date') {
        console.log('Invalid Date');
        record.addError(
          dateField,
          'Please check that the date is in yyyy-MM-dd format.'
        );

        // If the formatted date is valid, set the formatted value in the record and add a comment to it
      } else {
        console.log(formattedDate);
        record.set(dateField, formattedDate);
        record.addComment(dateField, 'Date has been formatted as yyyy-MM-dd');
      }
    } else {
      console.log('Invalid Date');
    }
  });

  // Check and round employer contribution amount
  const employerContributionValue = record.get(employerContribution); // Get the value of the employerContribution field from the record

  if (typeof employerContributionValue === 'number') {
    // Check if the value is a number
    const roundedValue = employerContributionValue.toFixed(2); // Round the value to two decimal places and assign it to a variable

    if (employerContributionValue !== parseFloat(roundedValue)) {
      // Check if the rounded value is different from the original value (i.e. it needed to be rounded)
      record.set(employerContribution, parseFloat(roundedValue)); // Set the employerContribution field in the record to the rounded value
      record.addInfo(
        employerContribution,
        'employerContribution has rounded to 2 decimal places'
      ); // Add an informational comment to the record indicating that the value was rounded
    } else {
      record.set(employerContribution, employerContributionValue); // If the value didn't need to be rounded, set the employerContribution field in the record to the original value
    }
  }

  return record; // Return the updated record with any changes made to the employerContribution field
}
