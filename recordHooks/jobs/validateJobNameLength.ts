// Function to validate the length of 'jobName' and add a warning if it exceeds 50 characters
export const validateJobNameLength = (record) => {
    try {
      let jobName = record.get('jobName');
      
      // Check if 'jobName' is provided and if its length is greater than 50 characters
      if (jobName && jobName.length > 50) {
        record.addWarning(
          'jobName',
          `Job Name '${jobName}' exceeds 50 characters. Please shorten it.`
        );
      }
    } catch (err) {
      console.error(err);
  
      // Add an error message to the record if an error occurs
      record.addError(
        'validateJobNameLength',
        `An error occurred: ${err.message}`
      );
    }
  };
  