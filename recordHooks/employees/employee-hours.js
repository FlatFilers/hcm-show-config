import { FlatfileRecord } from '@flatfile/hooks';
import { isNil, isNotNil } from '../../common/helpers';

export const employeeHours = (record) => {
  const empType = record.get('employeeType');
  const defHours = record.get('defaultWeeklyHours');
  const schedHours = record.get('scheduledWeeklyHours');
  const message = 'Scheduled Weekly Hours caclulated based on Employee Type';

  //Validations

  //Schedule Weekly Hours Cannot be greater than 168

  if (typeof schedHours === 'number' && isNotNil(schedHours)) {
    if (schedHours > 168) {
      record.addError(
        'scheduledWeeklyHours',
        'Scheduled Hours cannot exceed 168 hours'
      );
    }
  }

  // Default Weekly Hours Cannot be greater than 168

  if (typeof defHours === 'number' && isNotNil(defHours)) {
    if (defHours > 168) {
      record.addError(
        'defaultWeeklyHours',
        'Default Weekly Hours cannot exceed 168 hours'
      );
    }
  }

  //Transformations

  // Set Scheduled Weekly Hours Based on Employee Type

  // Need to update these to account for updates in Flatfile. ex: if employeetype is updated, need to update the scheduledWeeklyHours

  if (isNil(schedHours) && empType === 'ft') {
    record.set('scheduledWeeklyHours', 40);
    record.addInfo('scheduledWeeklyHours', message);
  }

  if (isNil(schedHours) && empType === 'pt') {
    record.set('scheduledWeeklyHours', 20);
    record.addInfo('scheduledWeeklyHours', message);
  }

  if (isNil(schedHours) && empType === 'tm') {
    record.set('scheduledWeeklyHours', 40);
    record.addInfo('scheduledWeeklyHours', message);
  }

  if (isNil(schedHours) && empType === 'ct') {
    record.set('scheduledWeeklyHours', 0);
    record.addInfo('scheduledWeeklyHours', message);
  }

  if (schedHours > defHours) {
    record.addWarning(
      'scheduledWeeklyHours',
      'Scheduled Hours exceeds Default Hours'
    );
  }

  // Calculations

  // FTE Cannot be greater than 999

  if (
    typeof defHours === 'number' &&
    isNotNil(defHours) &&
    typeof schedHours === 'number' &&
    isNotNil(schedHours)
  ) {
    const fte = schedHours / defHours;

    if (fte > 999) {
      record.addError(
        'scheduledWeeklyHours',
        `FTE must be 999 or less. FTE is calculated by dividing Scheduled Weekly Hours by Default Weekly Hours. Current FTE is ${fte}.`
      );
    }
  }
};
