export async function checkApiForExistingWorkers(record, employees) {
  try {
    // Get the current value of the Applicant_ID field
    let employeeId = record.get('employeeId');

    console.log('Employee_Id:', employeeId); // Log the current value of Applicant_ID

    // Check if the Applicant_ID matches an id from the API data
    const matchingEmployee = employees.find((employee) => {
      return employee.employeeId === employeeId;
    });

    console.log('Matching Employee:', matchingEmployee); // Log the matchingEmployee

    // If a match is found, add an error to the Applicant_ID field
    if (matchingEmployee) {
      console.log('Match found, adding error to Applicant_ID field'); // Log when a match is found
      record.addError(
        'employeeId',
        'Employee ID matches an id from the API data.'
      );
    }
  } catch (error) {
    console.log('Error occurred during API check:', error); // Log any errors that occurred during the check
    // If an error occurred during the check, add an error to the Applicant_ID field
    record.addError('employeeId', "Couldn't process data from the API.");
  }

  return record;
}
