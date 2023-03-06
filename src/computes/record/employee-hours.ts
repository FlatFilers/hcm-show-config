import { FlatfileRecord } from '@flatfile/hooks';
import {
  isNil,
  isNotNil,
} from '../../validations-plugins/common/helpers';

export const employeeHours = (record: FlatfileRecord<any>) => {
  const empType = record.get('employeeType');
  const defHours = record.get('defaultWeeklyHours');
  const schedHours = record.get('scheduledWeeklyHours');

  if (empType === 'ft') {
    record.set('defaultWeeklyHours',168)
  }

  if (isNil(defHours) && empType === 'pt') {
    record.set('defaultWeeklyHours',30)
  }

  if (isNil(defHours) && empType === 'tm') {
    record.set('defaultWeeklyHours',40)
  }

  if (isNil(defHours) && empType === 'ct') {
    record.set('defaultWeeklyHours',0)
  }

  if (schedHours > defHours) {
    record.addWarning('scheduledWeeklyHours','Scheduled Hours exceeds Default Hours')
  }

};