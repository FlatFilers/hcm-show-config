import { FlatfileRecord } from '@flatfile/hooks';
import * as dfns from 'date-fns';

export default function defaultsAndFormatting(record: FlatfileRecord) {
  const dateFields = ['coverageStartDate'];
  const employerContribution = 'employerContribution';

  //Format Dates

  dateFields.forEach((dateField) => {
    if (record.get(dateField)) {
      try {
        let thisDate = dfns.format(
          new Date(record.get(dateField) as string),
          'yyyy-MM-dd'
        );
        let parseDate = dfns.parseISO(thisDate);
        if (parseDate.toString() === 'Invalid Date') {
          console.log('Invalid Date');
        } else {
          console.log(parseDate);
          record.set(dateField, dfns.format(parseDate, 'yyyy-MM-dd'));
          record.addComment(dateField, 'Date has been formatted as yyyy-MM-dd');
        }
      } catch (err) {
        record.addError(
          dateField,
          'Please check that the date is formatted yyyy-MM-dd.'
        );
        console.log(err);
      }
    }

    //Check and Round Employer Contribution Amount
    if (record.get(employerContribution)) {
      record.set(
        employerContribution,
        Number(record.get(employerContribution)).toFixed(2)
      );
      record.addInfo(
        employerContribution,
        'employerContribution has rounded to 2 decimal places'
      );
    }
  });
  return record;
}
