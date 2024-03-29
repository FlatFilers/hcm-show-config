export async function checkApiForExistingWorkers(record, employees) {
  try {
    // Get the current value of the Applicant_ID field
    let employeeId = record.get('employeeId');

    console.log('Employee_Id:', employeeId); // Log the current value of Applicant_ID

    // Check if the Applicant_ID matches an id from the API data
    const matchingEmployee = employees.find((employee) => {
      return String(employee.employeeId) === String(employeeId); // Convert both to strings for comparison
    });

    // If a match is found, add an error to the Applicant_ID field
    console.log('Matching Employee:', matchingEmployee);
    if (matchingEmployee) {
      console.log('Match found, adding error to Applicant_ID field');
      record.addError(
        'employeeId',
        'Employee ID matches an existing ID in HCM.Show application.'
      );
    }
  } catch (error) {
    console.log('Error occurred during API check:', error); // Log any errors that occurred during the check
    // If an error occurred during the check, add an error to the Applicant_ID field
    record.addError('employeeId', "Couldn't process data from the API.");
  }
  return record;
}
