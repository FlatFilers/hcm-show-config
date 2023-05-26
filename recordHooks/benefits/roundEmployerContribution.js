import { FlatfileRecord } from '@flatfile/hooks';

export const roundEmployerContribution = (record) => {
  try {
    const employerContributionValue = record.get('employerContribution');

    if (typeof employerContributionValue === 'number') {
      const roundedValue = employerContributionValue.toFixed(2);

      if (employerContributionValue !== parseFloat(roundedValue)) {
        record.set('employerContribution', parseFloat(roundedValue));
        record.addInfo(
          'employerContribution',
          'employerContribution has rounded to 2 decimal places'
        );
      } else {
        record.set('employerContribution', employerContributionValue);
      }
    }
  } catch (err) {
    console.log(err);
    record.addError(
      'employerContribution',
      `An error occurred: ${err.message}`
    );
  }

  return record;
};
