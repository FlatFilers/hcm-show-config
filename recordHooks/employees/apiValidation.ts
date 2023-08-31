export async function checkApiForExistingWorkers(record, employees) {
  try {
    let employeeId = record.get('employeeId');
    console.log('Employee_Id Type:', typeof employeeId); // Log the type of employeeId

    // Log the first few employees' IDs and their types for comparison
    console.log(
      'Sample Employee IDs and their types:',
      employees
        .slice(0, 5)
        .map((e) => ({ id: e.employeeId, type: typeof e.employeeId }))
    );

    console.log('Employee_Id:', employeeId);
    const matchingEmployee = employees.find((employee) => {
      return String(employee.employeeId) === String(employeeId); // Convert both to strings for comparison
    });

    console.log('Matching Employee:', matchingEmployee);
    if (matchingEmployee) {
      console.log('Match found, adding error to Applicant_ID field');
      record.addError(
        'employeeId',
        'Employee ID matches an existing ID in HCM.Show application.'
      );
    }
  } catch (error) {
    console.log('Error occurred during API check:', error);
    record.addError('employeeId', "Couldn't process data from the API.");
  }
  return record;
}
