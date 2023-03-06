import { FlatfileRecord } from '@flatfile/hooks';
import {
  isNil,
  isNotNil,
} from '../../validations-plugins/common/helpers';

export const verifyDates = (record: FlatfileRecord<any>) => {
  const hireDate = record.get('hireDate');
  const termDate = record.get('endEmploymentDate');
  const job = record.getLinks('jobName');
  const title = record.get('positionTitle');
  const empType = record.get('employeeType');
  const effDate = job[0].effectiveDate;
  const inactive = job[0].inactive;
  const dept = job[0].jobDept;

  // Error if the termination date occurs before the employment date
  if (isNotNil(termDate) && isNotNil(hireDate) && hireDate > termDate) {
    const message = 'Hire Date cannot be after the End Employment Date';
    record.addError('hireDate',message);
    record.addError('endEmploymentDate',message);
  }

  if (isNotNil(hireDate) && isNotNil(effDate) && effDate > hireDate) {
    const message = 'Effective Date of job cannot be after the Hire Date';
    record.addError('hireDate',message);
  }

  if (inactive && isNil(termDate)) {
    const message = 'Employee job is inactive.';
    record.addWarning(['jobName','hireDate'],message)
  }

  if (isNil(title)) {
    record.set('positionTitle',dept);
    record.addInfo('positionTitle','Title defaulted to department name.')
  }

  if (empType == 'tm' && isNil(termDate)) {
    const message = 'Temp Employees must have an Employemnt End Date';
    record.addError('endEmploymentDate',message);    
  }
};
