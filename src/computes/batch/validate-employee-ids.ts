import { FlatfileRecords } from '@flatfile/hooks';
import { isNotNil } from '../../validations-plugins/common/helpers';
import { get } from '../../utils/fetch';

// const axios = require('axios');

export const validateEmployeeIds = async (payload: FlatfileRecords<any>) => {
  console.log('Calling out to /api/v1/employees');
  const employeesResponse = await get({
    host: 'hcm.show',
    path: '/api/v1/employees',
    token: 'TODO',
  });
  console.log('/api/v1/employees status:', employeesResponse.status);
  // console.log('employeesResponse', employeesResponse);

  if (!(employeesResponse.status >= 200 && employeesResponse.status < 300)) {
    payload.records.forEach((record) => {
      record.addError(
        'employeeId',
        'Error - could not fetch employees from API to verify ID.'
      );
      record.addError(
        'managerId',
        'Error - could not fetch employees from API to verify ID.'
      );
    });
    return;
  }

  const existingEmployeeIds = employeesResponse.data as string[];
  const employeIdsFromRecords = payload.records
    .filter((r) => isNotNil(r.get('employeeId')))
    .map((r) => r.get('employeeId') as string);

  payload.records.forEach((r) => {
    // If this employee ID exists, show that this would be an update and not a create
    if (
      isNotNil(r.get('employeeId')) &&
      existingEmployeeIds.includes(r.get('employeeId') as string)
    ) {
      r.addWarning(
        'employeeId',
        'This Employee ID already exists in HCM.show - this record will update the existing record on sync.'
      );
    }

    // Manager ID needs to be a valid Employee ID from either the DB or the existing dataset.
    const managerId = r.get('managerId') as string | null;

    if (
      isNotNil(managerId) &&
      !existingEmployeeIds.includes(managerId) &&
      !employeIdsFromRecords.includes(managerId)
    ) {
      r.addError(
        'managerId',
        'Manager ID does not exist in HCM.show or the imported records.'
      );
    }
  });
};
