import { FlatfileRecord } from '@flatfile/hooks';
import { isNil, isNotNil } from '../../validations-plugins/common/helpers';

export const verifyDates = (record: FlatfileRecord<any>) => {
  const hireDate = record.get('hireDate');
  const endEmploymentDate = record.get('endEmploymentDate');
  const job = record.getLinks('jobName');
  const title = record.get('positionTitle');
  const empType = record.get('employeeType');
  const effDate = job?.[0]?.effectiveDate;
  const inactive = job?.[0]?.inactive;
  const dept = job?.[0]?.jobDept;

  // Error if the termination date occurs before the employment date
  if (
    isNotNil(endEmploymentDate) &&
    isNotNil(hireDate) &&
    hireDate > endEmploymentDate
  ) {
    const message = 'Hire Date cannot be after the End Employment Date';
    record.addError('hireDate', message);
    record.addError('endEmploymentDate', message);
  }

  if (isNotNil(hireDate) && isNotNil(effDate) && effDate > hireDate) {
    const message = 'Effective Date of job cannot be after the Hire Date';
    record.addError('hireDate', message);
  }

  if (inactive && isNil(endEmploymentDate)) {
    const message = 'Job is currently inactive.';
    record.addWarning(['jobName'], message);
  }

  // Need to update this to account for updates in Flatfile. ex: if title is updated, need to update the positionTitle to dept

  if (isNil(title)) {
    record.set('positionTitle', dept);
    record.addInfo('positionTitle', 'Title defaulted to department name.');
  }

  if (empType == 'tm' && isNil(endEmploymentDate)) {
    const message = 'Temp Employees must have an Employemnt End Date';
    record.addError('endEmploymentDate', message);
  }

  if (empType != 'tm' && isNotNil(endEmploymentDate)) {
    const message = 'Employment End Date is only valid for Temp Employees';
    record.addError('endEmploymentDate', message);
  }
};
