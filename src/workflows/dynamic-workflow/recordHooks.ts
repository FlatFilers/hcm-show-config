import { FlatfileRecord } from '@flatfile/hooks';
import moment from 'moment';

export default function recordHooks(record: FlatfileRecord) {
  const dateFields = ['coverageStartDate'];
  const employerContribution = 'employerContribution';

  //Format Dates

  dateFields.forEach((dateField) => {
    if (record.get(dateField)) {
      try {
        const inputDate = record.get(dateField);
        if (typeof inputDate === 'string' && inputDate.trim().length > 0) {
          const thisDate = moment(inputDate.trim(), 'YYYY-MM-DD');
          if (!thisDate.isValid()) {
            console.log('Invalid Date');
          } else {
            console.log(thisDate);
            record.set(dateField, thisDate.format('YYYY-MM-DD'));
            record.addComment(
              dateField,
              'Date has been formatted as yyyy-MM-dd'
            );
          }
        } else {
          console.log('Invalid Date');
        }
      } catch (err) {
        record.addError(
          dateField,
          'Please check that the date is formatted correctly.'
        );
        console.log(err);
      }
    }
  });

  //Check and Round Employer Contribution Amount
  if (record.get(employerContribution)) {
    const originalValue = record.get(employerContribution).toString();
    const roundedValue = parseFloat(originalValue).toFixed(2);
    if (originalValue !== roundedValue) {
      record.set(employerContribution, roundedValue);
      record.addInfo(
        employerContribution,
        'employerContribution has rounded to 2 decimal places'
      );
    } else {
      record.set(employerContribution, originalValue);
    }
  }

  return record;
}
