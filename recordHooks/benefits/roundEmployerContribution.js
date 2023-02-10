import { FlatfileRecord } from '@flatfile/hooks';

// Function to round the employer contribution value in a FlatfileRecord
export const roundEmployerContribution = (record) => {
  try {
    // Get the value of the 'employerContribution' field from the record
    const employerContributionValue = record.get('employerContribution');

    // Check if the value is a number
    if (typeof employerContributionValue === 'number') {
      // Round the value to 2 decimal places
      const roundedValue = employerContributionValue.toFixed(2);

      // Check if rounding is necessary
      if (employerContributionValue !== parseFloat(roundedValue)) {
        // Update the 'employerContribution' field with the rounded value
        record.set('employerContribution', parseFloat(roundedValue));

        // Add an info message to the record indicating the rounding
        record.addInfo(
          'employerContribution',
          'employerContribution has rounded to 2 decimal places'
        );
      } else {
        // If rounding is not necessary, keep the original value
        record.set('employerContribution', employerContributionValue);
      }
    }
  } catch (err) {
    // If an error occurs during the rounding process, handle the error
    console.log(err);

    // Add an error message to the record indicating the error
    record.addError(
      'employerContribution',
      `An error occurred: ${err.message}`
    );
  }

  // Return the updated record
  return record;
};
